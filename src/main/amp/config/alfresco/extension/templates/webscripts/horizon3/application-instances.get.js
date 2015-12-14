var alfQuery = 'TYPE:"{http://www.alfresco.org/model/surf/1.0}applicationInstance"' +
                  ' AND PATH:"/app:company_home/cm:Applications//*"';

var queryDef = {
   query: alfQuery,
   language: "fts-alfresco",
   page: {maxItems: 50},
   templates: []
};

// Get article nodes
var pages = [],
    item,
    nodes = search.query(queryDef);

for (var i = 0, j = nodes.length; i < j; i++)
{
   // Create core object
   node = nodes[i];
   item = {
      nodeRef: node.nodeRef.toString(),
      name: node.name
   };

   // Get the application type of the application...
   var type = node.associations["surf:applicationType"];
   if (type && type.length)
   {
      item.applicationTypeNodeRef = type[0].nodeRef.toString();
      item.applicationTypeName = type[0].name;
   }

   pages.push(item);
}

model.data = pages;