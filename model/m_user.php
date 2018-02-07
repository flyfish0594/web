<?php
class m_user extends spModel
{
	var $pk="uid";
	var $table="user";

	function checkBind($weiboid)
	{
		$conditions = array('weiboid'=>$weiboid);
		$userInfo=$this->find($conditions);
		if($userInfo['uid']>0)
		{
			return 1;//已经绑定
		}
		else
		{
			return 0;//未绑定
		}
	}

	function reg()
	{
		$newrow = array( // PHP的数组
			'username' => $_REQUEST['username'],
			'password' => md5($_REQUEST['password']),
			'weiboid' => $_REQUEST['weiboid']
		);
		$rs=$this->create($newrow);  // 进行新增操作
		return $rs;//成功返回自增值，失败返回false
	}
}
?>