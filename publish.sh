#!/bin/bash

for package in $( jq ".workspaces[]" -cr package.json ) ; do
	pushd "./$package"
		yarn install
		rc=$?; if [[ $rc != 0 ]]; then exit $rc; fi
	popd
done

for package in $( jq ".workspaces[]" -cr package.json ) ; do
	pushd "./$package"
		yarn upgrade --latest --pattern "jec-"
		rc=$?; if [[ $rc != 0 ]]; then exit $rc; fi
	popd
done

for package in $( jq ".workspaces[]" -cr package.json ) ; do
	pushd "./$package"
		yarn format
		rc=$?; if [[ $rc != 0 ]]; then exit $rc; fi
	popd
done

for package in $( jq ".workspaces[]" -cr package.json ) ; do
	pushd "./$package"
		yarn build
		rc=$?; if [[ $rc != 0 ]]; then exit $rc; fi
	popd
done

for package in $( jq ".workspaces[]" -cr package.json ) ; do
	pushd "./$package"
		npm version $1
		rc=$?; if [[ $rc != 0 ]]; then exit $rc; fi
	popd
done

for package in $( jq ".workspaces[]" -cr package.json ) ; do
	pushd "./$package"
		#npm publish
		#rc=$?; if [[ $rc != 0 ]]; then exit $rc; fi
	popd
done

git commit -am "release($1)"
git tag "v$1"
