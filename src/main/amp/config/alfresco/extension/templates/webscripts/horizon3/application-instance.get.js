function main() {

   var appName = url.templateArgs.appName;
   var alfQuery = 'TYPE:"{http://www.alfresco.org/model/horizon3/1.0}applicationInstance"' +
                 ' AND PATH:"/app:company_home//*"' +
                 ' AND @cm:name:"' + appName + '"';
   
   var queryDef = {
      query: alfQuery,
      language: "fts-alfresco",
      page: {maxItems: 50},
      templates: []
   };
   
   var applicationResults = search.query(queryDef);
   if (!applicationResults.length)
   {
      status.code = 500;
      model.errorMessage = "Could not find application";
      return false;
   }
   else
   {
      model.success = true;

      var appNode = applicationResults[0];
      model.nodeRef = appNode.nodeRef.toString();
      model.name = appName;

      var applicationType = appNode.associations["hzn:applicationType"];
      if (applicationType && applicationType.length)
      {
         var appType = applicationType[0];
         model.applicationTypeNodeRef = appType.nodeRef.toString();
         model.applicationTypeName = appType.name;

         var rootPageNodeRef = appType.properties["surf:rootRage"]; // NOTE: Accidental typo in the model of "rootRage"
         model.applicationTypeRootPageNodeRef = appType.properties["surf:rootRage"];
         
         var rootPageNode = search.findNode(rootPageNodeRef);
         model.applicationTypeRootPageName = rootPageNode.name;
      }
      return true;
   }
}
model.success = main();