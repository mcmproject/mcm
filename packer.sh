# Removes .DS_Store files from a project
find . -name .DS_Store -print0 | xargs -0 git rm -f --ignore-unmatch

mkdir -p ../mcm_extension && mkdir -p ../mcm_extension/mcmc && mkdir -p ../mcm_extension/mcmf

# Google Chrome
cp -R ./public/ ../mcm_extension/mcmc/public/
cp manifest.json ../mcm_extension/mcmc/manifest.json
cp index.html ../mcm_extension/mcmc/index.html
zip -r ../mcm_extension/mcmc.zip ../mcm_extension/mcmc/*

# Mozilla Firefox
cp -R ./public/ ../mcm_extension/mcmf/public/
cp manifestff.json ../mcm_extension/mcmf/manifest.json
cp index.html ../mcm_extension/mcmf/index.html
zip -r ../mcm_extension/mcmf.zip ../mcm_extension/mcmf/*