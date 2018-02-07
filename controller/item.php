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
	protected $bodyKey='all';//��λ���Ƶ�Ӣ�ĵ���
	protected $aryHotKeys=array();
	
	function __construct()
	{
		include_once SP_PATH.'/Extensions/bodyInfo.php';
		$aryTrauma=array('0'=>'����','1'=>'�д�','2'=>'΢��','3'=>'�޴�');//���˳̶�
		$aryMethods=array('0'=>'����','1'=>'����','2'=>'����','3'=>'ע��','4'=>'��֬','5'=>'��Ƶ','6'=>'����','7'=>'����');//������ʽ
		$aryKeep=array('0'=>'����','1'=>'����','2'=>'3����-6����','3'=>'6����-1��','4'=>'1��-2��','5'=>'2��-3��','6'=>'3������');//ά��ʱ��
		$aryHotKeys=array('¡��','˫��Ƥ','����','��֬','����','�۷�','¡��','ֲ��','�۴�','�ᴽ');//��������
		$this->aryBodyUrl2Info=$aryBodyUrl2Info;
		$this->aryTrauma=$aryTrauma;
		$this->aryMethods=$aryMethods;
		$this->aryKeep=$aryKeep;
		$this->aryHotKeys=$aryHotKeys;//��������
		$this->aryBodyId2Info=$aryBodyId2Info;
		parent::__construct();
	}
	
	function index(){
		$objItem = spClass("m_item"); // ��spClass����ʼ����Ŀ���ݱ����ģ�������
		// ����ʹ����spPager��ͬʱ��spArgs���ܵ������page����
		$conditions=$this->_search();
		
		$sum = $objItem->findCount($conditions); // ʹ����findCount
		
		$this->sum=$sum;
		$aryTitle=array();
		foreach($this->curNav as $val)
		{
			$aryTitle[]=$val['name'];
		}
		$strTitle=implode('_',$aryTitle);//meta��ı���
		$this->results = $objItem->spPager($this->spArgs('page', 1), 4)->findAll($conditions); 
		// �����ȡ��ҳ���ݲ����͵�smartyģ����
		$this->pager = $objItem->spPager()->getPager();
		$this->title=$strTitle;
		$this->display("tpl/itemListNew.html");
	}

	function _search()
	{
		$hotKey='';
		$body=$trauma=$methods=$keep=0;
		$srcItem=$this->spArgs('srcitem');
		$hotKey=$this->spArgs('hotkey');//������Ŀ�ؼ���
		$aryWhere=array();
		if($hotKey && $srcItem)
		{
			exit('�Ƿ�url');
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
				exit('�Ƿ�url');
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
		
		//��ǰҳ�浼��
		$curNav=$this->_getNav($hotKey,$body,$trauma,$methods,$keep);
		$this->curNav=$curNav;

		//�ĸ���������������
		$this->con1=$this->_getOptionUrl(1,$body,$trauma,$methods,$keep);
		$this->con2=$this->_getOptionUrl(2,$body,$trauma,$methods,$keep);
		$this->con3=$this->_getOptionUrl(3,$body,$trauma,$methods,$keep);
		$this->con4=$this->_getOptionUrl(4,$body,$trauma,$methods,$keep);

		//���������ؼ��ʵ�����
		$this->con5=$this->_getOptionUrl(5,0,0,0,0);
		
		return $strWhere;

	}

	function _getNav($hotKey,$body,$trauma,$methods,$keep)
	{
		$tmpNav[]=array('name'=>'������Ŀ����','url'=>$this->srcItemUrl);
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
	
	//��ȡ4������������ѡ������������ؼ��ʵ�url
	function _getOptionUrl($type,$body,$trauma,$methods,$keep)
	{
		$optionArr=array();
		$bodyIndex=$this->bodyKey;//��ǰѡ��Ĳ�λ
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



	//��ȡ��Ŀ���ĸ������ֶ���ɵĵ���
	function _getItemNav($body,$trauma,$methods,$keep)
	{
		$aryNav=$bodyNav=$traumaNav=$methodsNav=$keepNav=array();
		$aryNav[]=array(array('name'=>'������Ŀ����','url'=>$this->topSrcItemUrl));

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
		$objItem = spClass("m_item"); // ��spClass����ʼ����Ŀ���ݱ����ģ�������
		$condition=array('id'=>intval($this->spArgs('id')));
		$detail=$objItem->find($condition);
		if(false==$detail)
		{
			exit('����Ŀ������');
		}
		$nav=$this->_getItemNav($detail['body_name'],$detail['trauma'],$detail['opera_methods'],$detail['keep_time']);
		
		//��ȡ����Ŀ��ͷ5��ҽ��
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

		$this->result=$detail;//ҽ���������ֶ�
		$this->nav=$nav;//��ǰ����λ�õĵ���
		$this->docs=$aryDocList;//����ҽ��ģ���ҽ���б�
		$this->display("tpl/itemDetailNew.html");
	}


	
}