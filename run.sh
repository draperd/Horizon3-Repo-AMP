#!/bin/bash
# Downloads the spring-loaded lib if not existing and      
# runs the Repo AMP applied to Alfresco WAR.           
# Note. the Share WAR is not deployed.              
springloadedfile=~/.m2/repository/org/springframework/springloaded/1.2.3.RELEASE/springloaded-1.2.3.RELEASE.jar

if [ ! -f $springloadedfile ]; then
mvn validate -Psetup
fi

echo $LD_LIBRARY_PATH | egrep "/home/dave/alfresco-5.0.2/common" > /dev/null
if [ $? -ne 0 ] ; then
PATH="/home/dave/alfresco-5.0.2/java/bin:/home/dave/alfresco-5.0.2/postgresql/bin:/home/dave/alfresco-5.0.2/common/bin:$PATH"
export PATH
LD_LIBRARY_PATH="/home/dave/alfresco-5.0.2/postgresql/lib:/home/dave/alfresco-5.0.2/common/lib:$LD_LIBRARY_PATH"
export LD_LIBRARY_PATH
fi

##### IMAGEMAGICK ENV #####
MAGICK_HOME="/home/dave/alfresco-5.0.2/common"
export MAGICK_HOME
MAGICK_CONFIGURE_PATH="/home/dave/alfresco-5.0.2/common/lib/ImageMagick-6.8.6/config-Q16"
export MAGICK_CONFIGURE_PATH
MAGICK_CODER_MODULE_PATH="/home/dave/alfresco-5.0.2/common/lib/ImageMagick-6.8.6/modules-Q16/coders"
export MAGICK_CODER_MODULE_PATH

GS_LIB="/home/dave/alfresco-5.0.2/common/share/ghostscript/fonts"
export GS_LIB

#MAVEN_OPTS="-javaagent:$springloadedfile -noverify -Xms256m -Xmx2G" mvn integration-test -Pamp-to-war
MAVEN_OPTS="-javaagent:$springloadedfile -noverify -Xms256m -Xmx2G -XX:PermSize=300m" mvn integration-test -Pamp-to-war
