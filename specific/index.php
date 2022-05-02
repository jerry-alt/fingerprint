<html>
<head>
  <meta charset="UTF-8">
  <title>Отпечаток браузера</title>
  <link href="https://getbootstrap.com/docs/5.1/dist/css/bootstrap.min.css" rel="stylesheet">
  <link rel="shortcut icon" href="/icon.png" type="image/png">
</head>

<body style="display:flex;justify-content: center;">
    <div style="max-width:70%; padding-top:0!important;" class="px-4 py-5 my-5 text-center">
  <hr/>
  <h1>Ваш отпечаток:</h1>
  <h2 class="btn btn-primary btn-lg" id="fp">Хеш</h2>
  <br><small>Сценарий: самая высокая точность (в пределах одного браузера)</small><br>
  <div class="lead mb-4" id="pa">Характеристики</div>
  <hr/>
  <script src="./script.js"></script>
  <?php
$servername = "Localhost";
$database = "###";
$username = "###";
$password = "###";
$conn = mysqli_connect($servername, $username, $password, $database);
if (!$conn)
{
    echo "Ошибка соединения: " . mysqli_connect_error();
}
else
{
    $sql = "SELECT * FROM hash WHERE hash=" . htmlspecialchars($_COOKIE["hash"]) . " ORDER BY date DESC LIMIT 1";
    $result = $conn->query($sql);
    if ($result->num_rows != 0)
    {
        echo '<div class="alert alert-primary d-flex align-items-center">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-exclamation-triangle-fill flex-shrink-0 me-2" viewBox="0 0 16 16" role="img" aria-label="Warning:">
    <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
  </svg>
      <div><h5>Вы уже посещали эту страницу. Запись из базы данных:<br></h5>';
        foreach ($result as $row)
        {
            $hash = $row["hash"];
            $parameters = $row["parameters"];
            echo '<div>' . $hash . " " . $parameters . '<br></div></div>';
        }
    }
    else
    {
        $parameters = substr(htmlspecialchars($_COOKIE["parameters"]) , 0, -14);
        if (htmlspecialchars($_COOKIE["hash"]) != '')
        {
            $sql = "INSERT INTO hash (hash, parameters) VALUES ('" . htmlspecialchars($_COOKIE["hash"]) . "', '" . $parameters . "')";
            $rs = $conn->query($sql);
        }
    }
    mysqli_close($conn);
}
?>
  </div>
</body>

</html>