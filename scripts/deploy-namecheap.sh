#!/usr/bin/env bash
set -euo pipefail

deploy_target="${DEPLOY_SSH_TARGET:-ayleezhb@server395.web-hosting.com}"
deploy_port="${DEPLOY_SSH_PORT:-21098}"
deploy_path="${DEPLOY_APP_PATH:-/home/ayleezhb/aylee-next}"

deploy_stage="$(mktemp -d "${TMPDIR:-/tmp}/aylee-next-deploy.XXXXXX")"

cleanup() {
  rm -rf "${deploy_stage}"
}
trap cleanup EXIT

echo "Building the production Next.js app..."
npm run build

if [[ ! -f .next/standalone/server.js ]]; then
  echo "Deployment failed: .next/standalone/server.js was not generated." >&2
  exit 1
fi

echo "Preparing the standalone server bundle..."
cp -R .next/standalone/. "${deploy_stage}/"

mkdir -p "${deploy_stage}/.next"
cp -R .next/static "${deploy_stage}/.next/static"

if [[ -d public ]]; then
  cp -R public "${deploy_stage}/public"
fi

echo "Uploading to ${deploy_target}:${deploy_path}/ ..."

rsync \
  -az \
  --progress \
  -e "ssh -p ${deploy_port}" \
  "${deploy_stage}/" \
  "${deploy_target}:${deploy_path}/"

echo "Requesting an application restart..."

ssh -p "${deploy_port}" "${deploy_target}" \
  "mkdir -p '${deploy_path}/tmp' && touch '${deploy_path}/tmp/restart.txt'"

echo "Deployment complete: https://aylee.store"
