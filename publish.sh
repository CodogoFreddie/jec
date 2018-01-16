#!/bin/bash

for package in $( jq ".workspaces[]" -cr package.json ) ; do
	pushd "./$package"
		echo
		echo
		echo
		echo "Publishing $package"

		yarn install
		rc=$?; if [[ $rc != 0 ]]; then exit $rc; fi

		yarn upgrade --latest --pattern "jec-"
		rc=$?; if [[ $rc != 0 ]]; then exit $rc; fi

		#yarn format
		#rc=$?; if [[ $rc != 0 ]]; then exit $rc; fi

		#yarn build
		#rc=$?; if [[ $rc != 0 ]]; then exit $rc; fi

		#npm version $1
		#rc=$?; if [[ $rc != 0 ]]; then exit $rc; fi

		#npm publish
		#rc=$?; if [[ $rc != 0 ]]; then exit $rc; fi
	popd
done

git commit -am "release($1)"
git tag "v$1"
