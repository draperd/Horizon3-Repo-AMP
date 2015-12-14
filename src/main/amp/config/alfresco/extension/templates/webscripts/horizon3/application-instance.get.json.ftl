<#if success!false == true>
{
   "success": "true",
   "nodeRef": "${nodeRef!""}",
   "applicationType": {
      "name": "${applicationTypeName!""}",
      "nodeRef": "${applicationTypeNodeRef!""}",
      "rootPage": {
         "name": "${applicationTypeRootPageName!""}",
         "nodeRef": "${applicationTypeRootPageNodeRef!""}" 
      }
   }
}
<#else>
{
   "success": "false",
   "error": "${msg(errorMessage!"", errorMessageArg!"")?html}"
}
</#if>