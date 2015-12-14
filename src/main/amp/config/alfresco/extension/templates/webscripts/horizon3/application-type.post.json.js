function main() {
   
   // This query should find the Share Resources folder 
   var alfQuery = 'PATH:"/app:company_home/app:dictionary/cm:ShareResources/cm:ApplicationTypes"';
      
   var queryDef = {
      query: alfQuery,
      language: "fts-alfresco",
      page: {maxItems: 50},
      templates: []
   };
   
   var shareResources,
       nodes = search.query(queryDef);
   if (nodes.length > 0)
   {
      shareResources = nodes[0];
      
      // Get the page name and JSON definition from the request parameters...
      var valid = true;
      var name = json.get("name");
      if (!name)
      {
         status.code = 500;
         model.errorMessage = "appType.create.error.noNameProvided";
         return false;
      }

      var rootPage = json.get("rootPage");
      if (!rootPage)
      {
         status.code = 500;
         model.errorMessage = "appType.create.error.noRootPageProvided";
         return false;
      }
      else
      {
         // Check the the rootPage exists...
         var rootPageNode = search.findNode(rootPage);
         if (!rootPageNode)
         {
            status.code = 500;
            model.errorMessage = "appType.create.error.rootPageDoesNotExist";
            return false;
         }
      }

      // Check to see if the page name is already in use...
      alfQuery = 'TYPE:"{http://www.alfresco.org/model/surf/1.0}applicationType"' +
                 ' AND PATH:"/app:company_home/app:dictionary//*"' +
                 ' AND @cm:name:"' + name + '"';
      queryDef.query = alfQuery;
      var existingAppTypes = search.query(queryDef);
      if (existingAppTypes.length == 1)
      {
         status.code = 500;
         model.errorMessage = "appType.create.error.nameAlreadyUsed";
         model.errorMessageArg = name;
         return false;
      }

      // Create the application type...
      var properties = new Array();
      properties["surf:rootRage"] = rootPage;
      var doc = shareResources.createNode(name, "surf:applicationType", properties);
      if (!doc)
      {
         status.code = 500;
         model.errorMessage = "appType.create.error.couldNotCreate";
         return false;
      }
      else
      {
         model.nodeRef = doc.nodeRef.toString();
         return true;
      }
   }
   else
   {
      // The Data Dictionary location for pages hasn't been set up...
      status.code = 500;
      model.errorMessage = "appType.create.error.noTargetLocation";
      return false;
   }
   
   // Shouldn't get to here - there should be a return at every code path...
   model.errorMessage = "appType.create.error.unexpected";
   status.code = 500;
   return false;
}

model.success = main();
