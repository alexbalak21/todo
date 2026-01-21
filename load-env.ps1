# Load .env file into PowerShell environment variables

Get-Content .env | ForEach-Object {
    if ($_ -match "^\s*#") { return }   # skip comments
    if ($_ -match "^\s*$") { return }   # skip empty lines
    $name, $value = $_ -split "=", 2
    Set-Item -Path "Env:$name" -Value $value
}

Write-Host ".env variables loaded into current session."
