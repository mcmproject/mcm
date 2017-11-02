# Skripta za pakovanje proširenja za različite pregledače za GNU/Linux i Unix-like sisteme
# Korišćen alat 'jq' za manipulaciju JSON fajlovima.

command -v jq >/dev/null 2>&1 || { echo >&2 "Instalirajte alat 'jq' da biste pokrenuli proces.\nhttp://stedolan.github.io/jq/"; exit 1; }

# Mozilla Firefox
if [ $1 = "firefox" ] || [ $1 = "ff" ]; then
    if [ -d "../mcmf/" ]; then
        cp -rf . ../mcmf
        if [ $0 -ne 0 ]; then
            echo "Došlo je do greške pri kopiranju sadržaja u direktorijum 'mcmf'."
        else
            cd ../mcmf
            jq '.description = "MyCity Manager proširenje za Mozilla Firefox pregledač i njegove derivate."' manifest.json > tmp.$$.json
            mv tmp.$$.json manifest.json
            rm -rf node_modules && rm -rf ts && rm packer.bat && rm packer.sh && rm .gitignore && rm README.md && rm package.json
            cd ../mcm
        fi
    else
        mkdir -p ../mcmf
        if [ $0 -ne 0 ]; then
            echo "Došlo je do greške pri kreiranju direktorijuma 'mcmf'."
        else
            cp -rf . ../mcmf
            if [ $0 -ne 0 ]; then
                echo "Došlo je do greške pri kopiranju sadržaja u direktorijum 'mcmf'."
            else
                cd ../mcmf
                jq '.description = "MyCity Manager proširenje za Mozilla Firefox pregledač i njegove derivate."' manifest.json > tmp.$$.json
                mv tmp.$$.json manifest.json
                rm -rf node_modules && rm -rf ts && rm packer.bat && rm packer.sh && rm .gitignore && rm README.md && rm package.json
                cd ../mcm
            fi
        fi
    fi

# Google Chrome
elif [ $1 = "chrome" ] || [ $1 = "ch" ]; then
    if [ -d "../mcmc/" ]; then
        cp -rf . ../mcmc
        if [ $0 -ne 0 ]; then
            echo "Došlo je do greške pri kopiranju sadržaja u direktorijum 'mcmc'."
        else
            cd ../mcmc
            rm -rf node_modules && rm -rf ts && rm packer.bat && rm packer.sh && rm .gitignore && rm README.md && rm package.json
            cd ../mcm
        fi
    else
        mkdir -p ../mcmc
        if [ $0 -ne 0 ]; then
            echo "Došlo je do greške pri kreiranju direktorijuma 'mcmc'."
        else
            cp -rf . ../mcmc
            if [ $0 -ne 0 ]; then
                echo "Došlo je do greške pri kopiranju sadržaja u direktorijum 'mcmc'."
            else
                cd ../mcmc
                rm -rf node_modules && rm -rf ts && rm packer.bat && rm packer.sh && rm .gitignore && rm README.md && rm package.json
                cd ../mcm
            fi
        fi
    fi
fi