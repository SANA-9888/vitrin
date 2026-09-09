$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

try {
    Set-Location $PSScriptRoot

    [Console]::OutputEncoding = New-Object System.Text.UTF8Encoding
    $OutputEncoding = [Console]::OutputEncoding

    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

    Write-Host ""
    Write-Host "Step 1: Checking project files..." -ForegroundColor Cyan

    $requiredFiles = @(
        "package.json",
        "deploy.mjs",
        "patch-project.mjs",
        "schema.sql",
        "src\worker.js",
        "src\storefront.js"
    )

    foreach ($file in $requiredFiles) {
        if (!(Test-Path $file)) {
            throw "Missing file: $file. Extract the complete ZIP before running the installer."
        }
    }

    if (!(Test-Path ".env")) {
        if (!(Test-Path ".env.example")) {
            throw ".env.example was not found."
        }

        Copy-Item ".env.example" ".env"

        Write-Host ""
        Write-Host "A .env file was created." -ForegroundColor Yellow
        Write-Host "Paste your Telegram bot token into TELEGRAM_BOT_TOKEN."
        Write-Host "Save the file, then return to this window."

        Start-Process notepad.exe -ArgumentList "`"$PSScriptRoot\.env`""

        Read-Host "After saving .env, press Enter"
    }

    Write-Host ""
    Write-Host "Step 2: Checking Node.js..." -ForegroundColor Cyan

    $nodeReady = $false
    $nodeCommand = Get-Command node.exe -ErrorAction SilentlyContinue
    $npmCommand = Get-Command npm.cmd -ErrorAction SilentlyContinue

    if ($nodeCommand -and $npmCommand) {
        try {
            $versionText = (& $nodeCommand.Source --version | Out-String).Trim()

            if ($versionText -match "^v(\d+)\.") {
                if ([int]$Matches[1] -ge 22) {
                    $nodeReady = $true
                    Write-Host "Using installed Node.js $versionText"
                }
            }
        } catch {
            $nodeReady = $false
        }
    }

    if (!$nodeReady) {
        $tools = Join-Path $PSScriptRoot ".tools"
        New-Item -ItemType Directory -Path $tools -Force | Out-Null

        $architecture = $env:PROCESSOR_ARCHITECTURE

        if ($env:PROCESSOR_ARCHITEW6432) {
            $architecture = $env:PROCESSOR_ARCHITEW6432
        }

        if ($architecture -eq "ARM64") {
            $nodeArch = "arm64"
        } elseif ($architecture -eq "AMD64") {
            $nodeArch = "x64"
        } else {
            throw "This installer supports 64-bit Windows and Windows ARM64."
        }

        $portableHome = Join-Path $tools "node-$nodeArch"
        $portableNode = Join-Path $portableHome "node.exe"
        $portableNpm = Join-Path $portableHome "npm.cmd"

        $portableReady = $false

        if ((Test-Path $portableNode) -and (Test-Path $portableNpm)) {
            try {
                $portableVersion = (& $portableNode --version | Out-String).Trim()

                if ($portableVersion -match "^v(\d+)\.") {
                    $portableReady = ([int]$Matches[1] -ge 22)
                }
            } catch {
                $portableReady = $false
            }
        }

        if (!$portableReady) {
            Write-Host "Downloading portable Node.js from nodejs.org..."

            $releases = Invoke-RestMethod `
                -Uri "https://nodejs.org/dist/index.json"

            $release = $releases |
                Where-Object {
                    $_.version -match "^v22\." -and
                    $_.files -contains "win-$nodeArch-zip"
                } |
                Select-Object -First 1

            if (!$release) {
                throw "A compatible Node.js 22 release was not found."
            }

            $version = [string]$release.version
            $archiveName = "node-$version-win-$nodeArch.zip"
            $baseUrl = "https://nodejs.org/dist/$version"

            $archivePath = Join-Path $tools $archiveName
            $checksumsPath = Join-Path $tools "SHASUMS256.txt"
            $extractPath = Join-Path $tools "extract-node"

            Invoke-WebRequest `
                -UseBasicParsing `
                -Uri "$baseUrl/$archiveName" `
                -OutFile $archivePath

            Invoke-WebRequest `
                -UseBasicParsing `
                -Uri "$baseUrl/SHASUMS256.txt" `
                -OutFile $checksumsPath

            $pattern = "^([a-fA-F0-9]{64})\s+\*?" +
                [regex]::Escape($archiveName) + "$"

            $checksumLine = Get-Content $checksumsPath |
                Where-Object { $_ -match $pattern } |
                Select-Object -First 1

            if (!$checksumLine) {
                throw "Official checksum was not found."
            }

            $null = $checksumLine -match $pattern
            $expectedHash = $Matches[1].ToLowerInvariant()
            $actualHash = (Get-FileHash $archivePath -Algorithm SHA256).Hash.ToLowerInvariant()

            if ($actualHash -ne $expectedHash) {
                Remove-Item $archivePath -Force
                throw "Node.js checksum verification failed. Run the installer again."
            }

            if (Test-Path $extractPath) {
                Remove-Item $extractPath -Recurse -Force
            }

            Expand-Archive `
                -Path $archivePath `
                -DestinationPath $extractPath `
                -Force

            $extractedHome = Join-Path $extractPath "node-$version-win-$nodeArch"

            if (!(Test-Path (Join-Path $extractedHome "node.exe"))) {
                throw "The Node.js archive did not contain the expected files."
            }

            if (Test-Path $portableHome) {
                Remove-Item $portableHome -Recurse -Force
            }

            Move-Item $extractedHome $portableHome

            Remove-Item $extractPath -Recurse -Force
            Remove-Item $archivePath -Force
            Remove-Item $checksumsPath -Force

            Write-Host "Portable Node.js is ready." -ForegroundColor Green
        }

        # فقط PATH همین پردازش تغییر می‌کند.
        $env:Path = "$portableHome;$env:Path"
    }

    $npm = (Get-Command npm.cmd -ErrorAction Stop).Source

    Write-Host ""
    Write-Host "Step 3: Installing project dependencies..." -ForegroundColor Cyan

    if (Test-Path "package-lock.json") {
        & $npm ci --no-audit --no-fund
    } else {
        & $npm install --no-audit --no-fund
    }

    if ($LASTEXITCODE -ne 0) {
        throw "Dependency installation failed. Check your internet connection and the error above."
    }

    Write-Host ""
    Write-Host "Step 4: Starting deployment wizard..." -ForegroundColor Cyan

    & $npm run deploy

    if ($LASTEXITCODE -ne 0) {
        throw "Deployment did not complete. Read the deployment error above."
    }

    exit 0
}
catch {
    Write-Host ""
    Write-Host ("ERROR: " + $_.Exception.Message) -ForegroundColor Red
    exit 1
}