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
			return 1;//�Ѿ���
		}
		else
		{
			return 0;//δ��
		}
	}

	function reg()
	{
		$newrow = array( // PHP������
			'username' => $_REQUEST['username'],
			'password' => md5($_REQUEST['password']),
			'weiboid' => $_REQUEST['weiboid']
		);
		$rs=$this->create($newrow);  // ������������
		return $rs;//�ɹ���������ֵ��ʧ�ܷ���false
	}
}
?>