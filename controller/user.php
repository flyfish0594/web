<?php
class User extends spController
{
	protected $objUser;
	function __construct()
	{
		parent::__construct();
		$this->objUser=spClass("m_user");
	}

	function index()
	{
		$this->display("tpl/landing.html");
	}
	
	function ajaxCheckBind()
	{
		header('Content-Type: text/html; charset=gbk');
		$weiboid=$this->spArgs('weiboid');
		$check=$this->objUser->checkBind($weiboid);
		echo $check;
	}

	function reg()
	{
		$button=$this->spArgs('button');
		if($button=='Ìá½»')
		{
			$this->objUser->reg();
		}
		
		$this->weiboid=$_REQUEST['weiboid'];
		$this->display("tpl/reg.html");
	}

}