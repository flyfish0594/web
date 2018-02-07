<?php
define("APP_PATH",dirname(__FILE__));
define("SP_PATH",dirname(__FILE__)."/SpeedPHP");
$spConfig = array(
        "db" => array(
                'host' => 'SAE_MYSQL_HOST_M',  // ���ݿ��ַ
                'login' => 'SAE_MYSQL_USER', // ���ݿ��û���
                'password' => 'SAE_MYSQL_PASS', // ���ݿ�����
                'database' => 'SAE_MYSQL_DB', // ���ݿ�Ŀ�����
        ),
        'view' => array(
                'enabled' => TRUE, // ����Smarty
                'config' =>array(
                        'template_dir' => APP_PATH.'/tpl', // ģ���ŵ�Ŀ¼
                        'compile_dir' => 'saemc://templates_c', // �������ʱĿ¼
                        'cache_dir' => 'saemc://cached', // ����Ŀ¼
                        'left_delimiter' => '<{',  // smarty���޶���
                        'right_delimiter' => '}>', // smarty���޶���
						'auto_literal' => TRUE, // Smarty3������ 
                ),
        ),
);






require(SP_PATH."/SpeedPHP.php");
spRun(); // SpeedPHP 3������