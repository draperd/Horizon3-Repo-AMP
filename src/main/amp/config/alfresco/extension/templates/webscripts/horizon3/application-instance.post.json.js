function main() {
   
   // This query should find the Share Resources folder 
   var alfQuery = 'PATH:"/app:company_home/cm:Applications"';
      
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

      // Check to see if the page name is already in use...
      alfQuery = 'TYPE:"{http://www.alfresco.org/model/horizon3/1.0}applicationInstance"' +
                 ' AND PATH:"/app:company_home/cm:ContentApps//*"' +
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

      var targetAppType = null;
      var applicationType = json.get("applicationType");
      if (!applicationType)
      {
         status.code = 500;
         model.errorMessage = "appType.create.error.noAppTypeProvided";
         return false;
      }
      else
      {
         // Check that the requested application type exists...
         var appTypeNode = search.findNode(applicationType);
         if (!appTypeNode)
         {
            status.code = 500;
            model.errorMessage = "appType.create.error.appTypeDoesNotExist";
            return false;
         }
         else
         {
            // Get the page name and it's content...
            var doc = shareResources.createNode(name, "hzn:applicationInstance");
            if (!doc)
            {
               status.code = 500;
               model.errorMessage = "appType.create.error.couldNotCreate";
               return false;
            }
            else
            {
               doc.createAssociation(appTypeNode, "hzn:applicationType");
               model.nodeRef = doc.nodeRef.toString();
               return true;
            }
         }
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
