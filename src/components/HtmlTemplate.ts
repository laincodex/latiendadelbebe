export default ({client, content, props, head} : {client :string, content :string, props :string, head :string}) => `
<html>
<head>
    ${head}
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&family=Passion+One&display=swap" rel="stylesheet"> 
    <link rel="stylesheet" href="/styles/app.css" />
</head>
<body>
    <div id="app">${content}</div>
    <script>window._initialProps=${props}</script>
    <script src="/vendor.js"></script>
    <script src="/${client}.js"></script>
</body>
</html>
`;