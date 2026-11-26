#!/usr/bin/env bash
set -eu

usage() {
  echo "usage: new-project.sh <artifactId> [--group id] [--package name] [--build maven|gradle|gradle-kotlin]"
  echo "       [--lang java|kotlin] [--java N] [--boot X.Y.Z] [--deps a,b] [--packaging jar|war] [--dir path]"
  exit 2
}

[ $# -ge 1 ] || usage
name=$1; shift
group=com.example; package=; build=maven; lang=java; java=; boot=; deps=; packaging=jar; dir=$name

while [ $# -gt 0 ]; do
  [ $# -ge 2 ] || usage
  case $1 in
    --group) group=$2 ;;
    --package) package=$2 ;;
    --build) build=$2 ;;
    --lang) lang=$2 ;;
    --java) java=$2 ;;
    --boot) boot=$2 ;;
    --deps) deps=$2 ;;
    --packaging) packaging=$2 ;;
    --dir) dir=$2 ;;
    *) usage ;;
  esac
  shift 2
done

case $build in
  maven) type=maven-project ;;
  gradle) type=gradle-project ;;
  gradle-kotlin) type=gradle-project-kotlin ;;
  *) echo "--build must be maven, gradle or gradle-kotlin" >&2; exit 2 ;;
esac

if [ -z "$java" ]; then
  bin=java
  from=PATH
  if [ -x "${JAVA_HOME:-}/bin/java" ]; then bin=$JAVA_HOME/bin/java; from=$JAVA_HOME; fi
  java=$("$bin" -version 2>&1 | sed -n 's/.*version "\(1\.\)\{0,1\}\([0-9]*\).*/\2/p' | head -1)
  [ -n "$java" ] || { echo "no JDK found: set JAVA_HOME or pass --java" >&2; exit 1; }
  [ "$java" -ge 17 ] || { echo "Spring Boot needs Java 17 or newer, found $java ($from). Set JAVA_HOME or pass --java" >&2; exit 1; }
  echo "java $java (from $from)"
fi

if [ -e "$dir" ] && [ -n "$(ls -A "$dir")" ]; then
  echo "$dir exists and is not empty" >&2
  exit 1
fi

zip=$(mktemp)
trap 'rm -f "$zip"' EXIT

set -- --data-urlencode "type=$type" --data-urlencode "language=$lang" --data-urlencode "groupId=$group" \
  --data-urlencode "artifactId=$name" --data-urlencode "name=$name" --data-urlencode "packaging=$packaging" \
  --data-urlencode "javaVersion=$java" --data-urlencode "dependencies=$deps"
[ -z "$package" ] || set -- "$@" --data-urlencode "packageName=$package"
[ -z "$boot" ] || set -- "$@" --data-urlencode "bootVersion=$boot"

code=$(curl -sS -G "https://start.spring.io/starter.zip" "$@" -o "$zip" -w '%{http_code}')
if [ "$code" != 200 ]; then
  cat "$zip" >&2
  echo >&2
  echo "start.spring.io answered $code" >&2
  exit 1
fi

mkdir -p "$dir"
unzip -q "$zip" -d "$dir"
chmod +x "$dir/mvnw" "$dir/gradlew" 2>/dev/null || true
echo "created $dir"
