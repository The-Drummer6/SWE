* Bei https://github.com registrieren, falls man dort noch nicht registriert ist.
  Die Registrierung ist für jspm erforderlich.

* Proxy konfigurieren: in einer Eingabeaufforderung ("cmd")
    * USERNAME ist der Platzhalter für die Benutzerkennung für die Poolrechner
      PASSWORD für das zugehörige Passwort

    * npm:
        npm c set proxy http://USERNAME:PASSWORD@proxy.hs-karlsruhe.de:8888
        npm c set https-proxy http://USERNAME:PASSWORD@proxy.hs-karlsruhe.de:8888

    * Git:
        git config --global http.proxy http://USERNAME:PASSWORD@proxy.hs-karlsruhe.de:8888
        git config --global https.proxy http://USERNAME:PASSWORD@proxy.hs-karlsruhe.de:8888
        git config --global url."http://".insteadOf git://

    * jspm:
        SET HTTP_PROXY=http://USERNAME:PASSWORD@proxy.hs-karlsruhe.de:8888
        SET HTTPS_PROXY=http://USERNAME:PASSWORD@proxy.hs-karlsruhe.de:8888

    * config\proxy\proxy.json editieren

* Installation in einer Eingabeaufforderung (einschl. Konfiguration von jspm für GitHub):
    npm install --verbose
    jspm registry config github
    jspm install

* CSS-Datei mittels Sass erstellen:
    gulp css

* Webserver (hier: browser-sync) starten
    gulp webserver

* json-server starten
    gulp jsonserver

* Codequalität mit TSLint überprüfen
    gulp tslint

* Formatierung mit clang-format überprüfen
    gulp clang-format

* Proxy-Einstellung künftig ein-/ausschalten:
    gulp proxy
    gulp noproxy

* Umformatieren einer einzelnen Datei mit clang-format:
  .\node_modules\gulp-clang-format\node_modules\.bin\clang-format -i -style="file" src\buchverwaltung\model\buch.ts
