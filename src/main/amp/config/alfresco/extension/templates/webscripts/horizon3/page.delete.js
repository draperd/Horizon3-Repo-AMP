function main() {
   var pageName = url.templateArgs.pageName;
   var alfQuery = 'TYPE:"{http://www.alfresco.org/model/surf/1.0}amdpage"' +
                 ' AND PATH:"/app:company_home//*"' +
                 ' AND @cm:name:"' + pageName + '"';
   
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
      model.errorMessage = "Could not find page";
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
         model.message = "Page " + pageName + " (" + appNodeRef + ") deleted";
      }
   }
}

main();