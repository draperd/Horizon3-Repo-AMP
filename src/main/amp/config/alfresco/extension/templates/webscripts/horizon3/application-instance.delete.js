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
      var appNode = applicationResults[0];
      var appNodeRef = appNode.nodeRef;
      var isDeleted = appNode.remove();
      if (!isDeleted)
      {
         status.setCode(status.STATUS_INTERNAL_SERVER_ERROR, "Unable to delete node: " + nodeRef);
      }
      else
      {
         model.message = "Application " + appName + " (" + appNodeRef + ") deleted";
      }
   }
}

main();