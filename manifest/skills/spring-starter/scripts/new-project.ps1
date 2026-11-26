[CmdletBinding()]
param(
  [Parameter(Mandatory, Position = 0)][string]$Name,
  [string]$Group = 'com.example',
  [string]$Package,
  [ValidateSet('maven', 'gradle', 'gradle-kotlin')][string]$Build = 'maven',
  [ValidateSet('java', 'kotlin')][string]$Lang = 'java',
  [string]$Java,
  [string]$Boot,
  [string[]]$Deps = @(),
  [ValidateSet('jar', 'war')][string]$Packaging = 'jar',
  [string]$Dir
)

$ErrorActionPreference = 'Stop'
if (-not $Dir) { $Dir = $Name }

if (-not $Java) {
  $home_ = if ($env:JAVA_HOME -and (Test-Path (Join-Path $env:JAVA_HOME 'bin\java.exe'))) { $env:JAVA_HOME }
  $exe = if ($home_) { Join-Path $home_ 'bin\java.exe' } else { 'java' }
  $out = & $exe -version 2>&1 | Out-String
  if ($out -notmatch 'version "(?:1\.)?(\d+)') { throw 'no JDK found: set JAVA_HOME or pass -Java' }
  $Java = $Matches[1]
  if ([int]$Java -lt 17) { throw "Spring Boot needs Java 17 or newer, found $Java ($(if ($home_) { $home_ } else { 'PATH' })). Set JAVA_HOME or pass -Java" }
  Write-Host "java $Java (from $(if ($home_) { $home_ } else { 'PATH' }))"
}

if ((Test-Path $Dir) -and (Get-ChildItem $Dir -Force | Select-Object -First 1)) {
  throw "$Dir exists and is not empty"
}

$type = @{ maven = 'maven-project'; gradle = 'gradle-project'; 'gradle-kotlin' = 'gradle-project-kotlin' }[$Build]
$query = [ordered]@{
  type = $type; language = $Lang; groupId = $Group; artifactId = $Name; name = $Name
  packaging = $Packaging; javaVersion = $Java; dependencies = ($Deps -join ',')
}
if ($Package) { $query.packageName = $Package }
if ($Boot) { $query.bootVersion = $Boot }
$qs = ($query.GetEnumerator() | ForEach-Object { "$($_.Key)=$([uri]::EscapeDataString($_.Value))" }) -join '&'

$zip = Join-Path ([IO.Path]::GetTempPath()) ("starter-" + [guid]::NewGuid() + '.zip')
try {
  try {
    Invoke-WebRequest "https://start.spring.io/starter.zip?$qs" -OutFile $zip -UseBasicParsing
  } catch {
    if ($_.ErrorDetails.Message) { Write-Error $_.ErrorDetails.Message -ErrorAction Continue }
    throw "start.spring.io rejected the request: $($_.Exception.Message)"
  }
  New-Item -ItemType Directory -Force $Dir | Out-Null
  Expand-Archive $zip -DestinationPath $Dir
} finally {
  Remove-Item $zip -Force -ErrorAction SilentlyContinue
}
Write-Host "created $Dir"
