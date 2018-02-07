<?php
define("APP_PATH",dirname(__FILE__));
define("SP_PATH",dirname(__FILE__)."/SpeedPHP");
$spConfig = array(
        "db" => array(
                'host' => 'SAE_MYSQL_HOST_M',  // 数据库地址
                'login' => 'SAE_MYSQL_USER', // 数据库用户名
                'password' => 'SAE_MYSQL_PASS', // 数据库密码
                'database' => 'SAE_MYSQL_DB', // 数据库的库名称
        ),
        'view' => array(
                'enabled' => TRUE, // 开启Smarty
                'config' =>array(
                        'template_dir' => APP_PATH.'/tpl', // 模板存放的目录
                        'compile_dir' => 'saemc://templates_c', // 编译的临时目录
                        'cache_dir' => 'saemc://cached', // 缓存目录
                        'left_delimiter' => '<{',  // smarty左限定符
                        'right_delimiter' => '}>', // smarty右限定符
						'auto_literal' => TRUE, // Smarty3新特性 
                ),
        ),
);






require(SP_PATH."/SpeedPHP.php");
spRun(); // SpeedPHP 3新特性