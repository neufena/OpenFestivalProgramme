#!/bin/bash

#Package Backend
cp -R AJAX ../build/packages
cp -R CLI ../build/packages
cp -R database ../build/packages
cp -R includes ../build/packages
mv ../build/packages/includes/config.dist.php -> ../build/packages/includes/config.php

#Package Web & PhoneGap

cp -R css ../build/packages
cp -R js ../build/packages
cp index.html ../build/packages
cp .htaccess ../build/packages
cp offline.manifest.dist ../build/packages
mv ../build/packages/mobileProgrammeClass.min.js ../build/packages/js/mobileProgrammeClass.js
mv ../build/packages/js/config.dist.js ../build/packages/web/config.js
cp config.dist.xml ../build/packages/config.xml

cd ../build/packages
tar czf MobileFestivalProgramme.tar.gz *