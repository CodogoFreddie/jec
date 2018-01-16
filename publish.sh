#!/bin/bash

for package in $( jq ".workspaces[]" -cr package.json ) ; do
	pushd "./$package"
		echo
		echo
		echo
		echo "Publishing $package"
		yarn upgrade-interactive --latest
		rc=$?; if [[ $rc != 0 ]]; then exit $rc; fi

		#yarn format
		#rc=$?; if [[ $rc != 0 ]]; then exit $rc; fi

		#yarn build
		#rc=$?; if [[ $rc != 0 ]]; then exit $rc; fi

		echo "yarn version --no-git-tag-version --new-version $1"
		rc=$?; if [[ $rc != 0 ]]; then exit $rc; fi

		echo "yarn publish"
		rc=$?; if [[ $rc != 0 ]]; then exit $rc; fi
	popd

done

git commit -am "release($1)"
git tag "v$1"
