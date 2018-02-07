<?php
class Item extends spController
{
	protected $aryBodyUrl2Info=array();
	protected $aryBodyId2Info=array();
	protected $aryTrauma=array();
	protected $aryMethods=array();
	protected $aryKeep=array();
	protected $navUrl=array();
	protected $srcItemUrl="/";
	protected $topSrcItemUrl="http://eladies.sina.com.cn/zx/xms/";
	protected $bodyKey='all';//部位名称的英文单词
	protected $aryHotKeys=array();
	
	function __construct()
	{
		include_once SP_PATH.'/Extensions/bodyInfo.php';
		$aryTrauma=array('0'=>'不限','1'=>'有创','2'=>'微创','3'=>'无创');//受伤程度
		$aryMethods=array('0'=>'不限','1'=>'开刀','2'=>'激光','3'=>'注射','4'=>'吸脂','5'=>'射频','6'=>'纹绣','7'=>'其他');//手术方式
		$aryKeep=array('0'=>'不限','1'=>'永久','2'=>'3个月-6个月','3'=>'6个月-1年','4'=>'1年-2年','5'=>'2年-3年','6'=>'3年以上');//维持时间
		$aryHotKeys=array('隆胸','双眼皮','瘦脸','吸脂','除皱','嫩肤','隆鼻','植发','眼袋','丰唇');//热门搜索
		$this->aryBodyUrl2Info=$aryBodyUrl2Info;
		$this->aryTrauma=$aryTrauma;
		$this->aryMethods=$aryMethods;
		$this->aryKeep=$aryKeep;
		$this->aryHotKeys=$aryHotKeys;//热门搜索
		$this->aryBodyId2Info=$aryBodyId2Info;
		parent::__construct();
	}
	
	function index(){
		$objItem = spClass("m_item"); // 用spClass来初始化项目数据表对象（模型类对象）
		// 这里使用了spPager，同时用spArgs接受到传入的page参数
		$conditions=$this->_search();
		
		$sum = $objItem->findCount($conditions); // 使用了findCount
		
		$this->sum=$sum;
		$aryTitle=array();
		foreach($this->curNav as $val)
		{
			$aryTitle[]=$val['name'];
		}
		$strTitle=implode('_',$aryTitle);//meta里的标题
		$this->results = $objItem->spPager($this->spArgs('page', 1), 4)->findAll($conditions); 
		// 这里获取分页数据并发送到smarty模板内
		$this->pager = $objItem->spPager()->getPager();
		$this->title=$strTitle;
		$this->display("tpl/itemListNew.html");
	}

	function _search()
	{
		$hotKey='';
		$body=$trauma=$methods=$keep=0;
		$srcItem=$this->spArgs('srcitem');
		$hotKey=$this->spArgs('hotkey');//热门项目关键词
		$aryWhere=array();
		if($hotKey && $srcItem)
		{
			exit('非法url');
		}

		if($hotKey)
		{
			$aryWhere[]="name like '%$hotKey%'";
		}

		if(false==empty($srcItem))
		{
			$arySrcItem=explode('_',$srcItem);
			
			$checkBody=array_key_exists($arySrcItem[0],$this->aryBodyUrl2Info);
			if(count($arySrcItem)!=4
				|| false==$checkBody
				|| false==in_array($arySrcItem[1],range(0,3))
				|| false==in_array($arySrcItem[2],range(0,7))
				|| false==in_array($arySrcItem[3],range(0,6))
			)
			{
				exit('非法url');
			}
			else
			{
				$body=$this->aryBodyUrl2Info[$arySrcItem[0]][1];
				$trauma=$arySrcItem[1];
				$methods=$arySrcItem[2];
				$keep=$arySrcItem[3];
			}
		}

		
		if(false==empty($body))
		{
			$aryWhere[]="concat(',',body_name,',') like '%,$body,%'";
			$this->bodyKey=$arySrcItem[0];
		}

		if(false==empty($trauma))
		{
			$aryWhere[]="trauma like '%$trauma%'";
		}

		if(false==empty($methods))
		{
			$aryWhere[]="opera_methods like '%$methods%'";
		}

		if(false==empty($keep))
		{
			$aryWhere[]="keep_time like '%$keep%'";
		}
		
		if(count($aryWhere)>0)
		{
			$strWhere=implode(' AND ',$aryWhere);
		}
		else
		{
			$strWhere='';
		}
		
		//当前页面导航
		$curNav=$this->_getNav($hotKey,$body,$trauma,$methods,$keep);
		$this->curNav=$curNav;

		//四个搜索条件的数组
		$this->con1=$this->_getOptionUrl(1,$body,$trauma,$methods,$keep);
		$this->con2=$this->_getOptionUrl(2,$body,$trauma,$methods,$keep);
		$this->con3=$this->_getOptionUrl(3,$body,$trauma,$methods,$keep);
		$this->con4=$this->_getOptionUrl(4,$body,$trauma,$methods,$keep);

		//热门搜索关键词的数组
		$this->con5=$this->_getOptionUrl(5,0,0,0,0);
		
		return $strWhere;

	}

	function _getNav($hotKey,$body,$trauma,$methods,$keep)
	{
		$tmpNav[]=array('name'=>'整形项目搜索','url'=>$this->srcItemUrl);
		if($hotKey)
		{
			$tmpNav[]=array('name'=>$hotKey,'url'=>$this->srcItemUrl.'hotitem/'.urlencode($hotKey).'/');
			return $tmpNav;
		}

		if($body)
		{
			$bodyIndex=$this->bodyKey;
			$bodyInfo=$this->aryBodyUrl2Info[$bodyIndex];
			$bodyName=$bodyInfo[0];

			$tmpNav[]=array('name'=>$bodyName,'url'=>$this->srcItemUrl.'body/'.$bodyIndex.'_0_0_0/');
		}

		if($trauma)
		{
			$tmpNav[]=array('name'=>$this->aryTrauma[$trauma],'url'=>$this->srcItemUrl.'body/all_'.$trauma.'_0_0/');
		}

		if($methods)
		{
			$tmpNav[]=array('name'=>$this->aryMethods[$methods],'url'=>$this->srcItemUrl.'body/all_0_'.$methods.'_0/');
		}

		if($keep)
		{
			$tmpNav[]=array('name'=>$this->aryKeep[$keep],'url'=>$this->srcItemUrl.'body/all_0_0_'.$keep.'/');
		}
		return $tmpNav;
	}
	
	//获取4个搜索条件的选项和热门搜索关键词的url
	function _getOptionUrl($type,$body,$trauma,$methods,$keep)
	{
		$optionArr=array();
		$bodyIndex=$this->bodyKey;//当前选择的部位
		if($type==1)
		{
			foreach($this->aryBodyUrl2Info as $key=>$value)
			{
				$selected=$key==$bodyIndex?1:0;
				$optionArr[]=array('name'=>$value[0],'url'=>$this->srcItemUrl.'body/'.$key.'_'.$trauma.'_'.$methods.'_'.$keep.'/','selected'=>$selected);
			}
		}
		else if($type==2)
		{
			foreach($this->aryTrauma as $key=>$value)
			{
				$selected=$key==$trauma?1:0;
				$optionArr[]=array('name'=>$value,'url'=>$this->srcItemUrl.'body/'.$bodyIndex.'_'.$key.'_'.$methods.'_'.$keep.'/','selected'=>$selected);
			}
		}
		else if($type==3)
		{
			foreach($this->aryMethods as $key=>$value)
			{
				$selected=$key==$methods?1:0;
				$optionArr[]=array('name'=>$value,'url'=>$this->srcItemUrl.'body/'.$bodyIndex.'_'.$trauma.'_'.$key.'_'.$keep.'/','selected'=>$selected);
			}
		}
		else if($type==4)
		{
			foreach($this->aryKeep as $key=>$value)
			{
				$selected=$key==$keep?1:0;
				$optionArr[]=array('name'=>$value,'url'=>$this->srcItemUrl.'body/'.$bodyIndex.'_'.$trauma.'_'.$methods.'_'.$key.'/','selected'=>$selected);
			}
		}
		else if($type==5)
		{
			foreach($this->aryHotKeys as $key)
			{
				$selected=$key==$this->spArgs('hotkey')?1:0;
				$optionArr[]=array('name'=>$key,'url'=>$this->srcItemUrl.'hotitem/'.urlencode($key).'/','selected'=>$selected);
			}
		}
		return $optionArr;
	}



	//获取项目的四个搜索字段组成的导航
	function _getItemNav($body,$trauma,$methods,$keep)
	{
		$aryNav=$bodyNav=$traumaNav=$methodsNav=$keepNav=array();
		$aryNav[]=array(array('name'=>'整形项目搜索','url'=>$this->topSrcItemUrl));

		foreach(explode(',',$body) as $key)
		{
			$bodyNav[]=array('name'=>$this->aryBodyId2Info[$key][1],'url'=>$this->topSrcItemUrl.'#body/'.$this->aryBodyId2Info[$key][0].'_0_0_0/');
		}
		$aryNav[]=$bodyNav;

		if($trauma)
		{
			foreach(explode(',',$trauma) as $key)
			{
				$traumaNav[]=array('name'=>$this->aryTrauma[$key],'url'=>$this->topSrcItemUrl.'#body/all_'.$key.'_0_0/');
			}
			$aryNav[]=$traumaNav;
		}
		
		if($methods)
		{
			foreach(explode(',',$methods) as $key)
			{
				$methodsNav[]=array('name'=>$this->aryMethods[$key],'url'=>$this->topSrcItemUrl.'#body/all_0_'.$key.'_0/');
			}
			$aryNav[]=$methodsNav;
		}

		if($keep)
		{
			foreach(explode(',',$keep) as $key)
			{
			
				$keepNav[]=array('name'=>$this->aryKeep[$key],'url'=>$this->topSrcItemUrl.'#body/all_0_0_'.$key.'/');
			}
			$aryNav[]=$keepNav;
		}
		
		return $aryNav;
	}



	function view()
	{
		$objItem = spClass("m_item"); // 用spClass来初始化项目数据表对象（模型类对象）
		$condition=array('id'=>intval($this->spArgs('id')));
		$detail=$objItem->find($condition);
		if(false==$detail)
		{
			exit('该项目不存在');
		}
		$nav=$this->_getItemNav($detail['body_name'],$detail['trauma'],$detail['opera_methods'],$detail['keep_time']);
		
		//获取该项目的头5名医生
		$objDoc=spClass("m_doctor");
		$aryWhere=array();
		foreach(explode(',',$detail['body_name']) as $opera)
		{
			$aryWhere[]="concat(',',operations,',') like '%,$opera,%'";
		}
		$strWhere=' WHERE '.implode(' OR ',$aryWhere);
		
		$aryDocList=$objDoc->findSql('SELECT doctor_id,doctor_name,job_titles,doctor_pict FROM doctor '.$strWhere.' order by rand() limit 5'); 
		
		if(false==$aryDocList)
		{
			$aryDocList=$objDoc->findSql('SELECT doctor_id,doctor_name,job_titles,doctor_pict FROM doctor order by rand() limit 5');
		}

		$this->result=$detail;//医生的所有字段
		$this->nav=$nav;//当前所在位置的导航
		$this->docs=$aryDocList;//其他医生模块的医生列表
		$this->display("tpl/itemDetailNew.html");
	}


	
}