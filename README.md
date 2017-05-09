Microsoft Graph API OneNote Node.js Sample README
-------------------------------------------------

Created by Microsoft Corporation, 2017. Provided As-is without warranty. Trademarks mentioned here are the property of their owners.

### API functionality demonstrated in this sample

The following aspects of the API are covered in this sample. You can find additional documentation at the links below.

-	[Log-in the user](https://developer.microsoft.com/en-us/graph/docs/authorization/app_authorization)
-	[GET a user's OneNote notebooks](https://developer.microsoft.com/en-us/graph/docs/api-reference/beta/api/notebook_get)
-	[GET a user's OneNote notebooks with expanded sections](https://msdn.microsoft.com/en-us/library/azure/ad/graph/howto/azure-ad-graph-api-supported-queries-filters-and-paging-options?f=255&MSPPError=-2147217396#expand)
-	[GET a user's OneNote pages](https://developer.microsoft.com/en-us/graph/docs/api-reference/beta/api/page_get)
-	[GET a user's OneNote sections](https://developer.microsoft.com/en-us/graph/docs/api-reference/beta/api/section_get)
-	[POST simple HTML to a new OneNote QuickNotes page](https://developer.microsoft.com/en-us/graph/docs/api-reference/beta/api/notes_post_pages)
-	[POST multi-part message with image data included in the request\*](http://msdn.microsoft.com/EN-US/library/office/dn575432.aspx)
-	[POST page with a URL rendered as an image\*](http://msdn.microsoft.com/EN-US/library/office/dn575431.aspx)
-	[POST page with HTML rendered as an image\*](http://msdn.microsoft.com/en-us/library/office/dn575432.aspx)
-	[POST page with a PDF file rendered and attached\*](http://msdn.microsoft.com/EN-US/library/office/dn655137.aspx)

\* Indicates documentation for multi-part POST requests to the OneNote API before its integration into the Microsoft Graph API. The documentation for the outlined request examples work as of the production of this sample, but be aware that changes may be upcoming.

### Prerequisites

**Tools and Libraries** you will need to download, install, and configure for your development environment.

-	[Node.js](http://nodejs.org/download)
-	[Express framework for Node.js](http://expressjs.com)
-	You have a normal URL with hostname (not just an IP address) to use for the Redirect URL. If you run this from your own desktop, you'll need to modify your Hosts file (in C:\Windows\System32\drivers\etc for Windows machines and /private/etc for Macs) and map your local server IP address to a new domain name, as in the following example. ![Modify your HOSTS file to map your local server IP address.](images/HostsFile.png)

**Accounts**

-	As the developer, you'll need to [have a Microsoft account and get a client ID string](http://msdn.microsoft.com/EN-US/library/office/dn575426.aspx) so your app can authenticate with the Microsoft Azure AD v2.0 endpoint.
-	As the user of the sample, you'll need a Microsoft account so the OneNote API can send the pages to your OneDrive.

### Using the sample

After you've setup your web server described above,....

1.	Download the repo as a ZIP file to your local computer, and extract the files. Or, clone the repository into a local copy of Git.
2.	Go to the [Microsoft app registration page](https://account.live.com/developers/applications/index).
3.	Set the Redirect URI to the domain name of your web site. In this example, we used http://localhost:3000/callback. The root domain name must be unique, so if you use one domain for testing and another for production, you'll need to register separate client ids and secrets for each domain.
4.	On the App Setting page, copy the client ID and secret into the config.js file.
5.	Open a command prompt and go to the root directory of the project.
6.	Setup project dependencies with the `npm install` command.
7.	Run the app with the `npm start` command.
8.	Open a browser and navigate to the app running by default on port 3000.
9.	Login using your Microsoft account (Org ID or MSA), and allow the app to create pages in your OneNote notebooks.

### Version info

| Date         | Change                                                                         |
|--------------|--------------------------------------------------------------------------------|
| May 2017     | Updated to utilize the Microsoft Graph v1.0 base URL for OneNote resources     |
| April 2017   | Updated to utilize the Microsoft Graph API endpoints.                          |
| June 2016    | Initial public release for this code sample.                                   |

### Learning More

-	Visit the [dev.onenote.com](http://dev.onenote.com) Dev Center
-	Contact us on [StackOverflow (tagged OneNote)](http://go.microsoft.com/fwlink/?LinkID=390182)
-	Follow us on [Twitter @onenotedev](http://www.twitter.com/onenotedev)
-	Read our [OneNote Developer blog](http://go.microsoft.com/fwlink/?LinkID=390183)
-	Explore the API using the [Graph Explorer](https://developer.microsoft.com/en-us/graph/graph-explorer)
-	[API Reference](https://developer.microsoft.com/en-us/graph/docs/api-reference/beta/resources/notes) documentation
-	[Known Issues](https://developer.microsoft.com/en-us/graph/docs/overview/release_notes)
-	[Getting Started](https://developer.microsoft.com/en-us/graph/docs/get-started/get-started) with the Microsoft Graph API

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.
