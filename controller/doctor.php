<?php
class Doctor extends spController
{
	protected $aryBodyUrl2Info=array();
	protected $aryBodyId2Info=array();
	protected $navUrl=array();
	protected $srcDocUrl="/srcdoc";
	protected $topSrcDocUrl="http://eladies.sina.com.cn/zx/yss/";
	protected $bodyKey='all';//部位名称的英文单词
	protected $aryHotCitys=array();
	protected $aryAreaUrl2Info=array();
	protected $aryAreaId2Info=array();
	
	function __construct()
	{
		include_once SP_PATH.'/Extensions/bodyInfo.php';
		include_once SP_PATH.'/Extensions/areaUrl2Info.php';
		include_once SP_PATH.'/Extensions/areaId2Info.php';

		$aryHotCitys=array('北京'=>'beijing','上海'=>'shanghai','广州'=>'guangzhou','深圳'=>'shenzhen','成都'=>'chengdu','南京'=>'nanjing','武汉'=>'wuhan','杭州'=>'hangzhou');//热门城市

		$this->aryBodyUrl2Info=$aryBodyUrl2Info;//整形项目url对应整形项目信息
		$this->aryBodyId2Info=$aryBodyId2Info;//整形项目id对应整形项目信息
		$this->aryHotCitys=$aryHotCitys;//热门城市
		$this->aryAreaUrl2Info=$aryAreaUrl2Info;
		$this->aryAreaId2Info=$aryAreaId2Info;
		parent::__construct();
	}
	
	function index(){
		$objDoc=spClass("m_doctor"); // 用spClass来初始化医生数据表对象（模型类对象）
		// 这里使用了spPager，同时用spArgs接受到传入的page参数
		/*把地区信息生成文件
		$aryAreaList=$objDoc->findSql('SELECT * FROM area where pid>0');
		$aryAreaUrl2Info=array();
		$aryAreaId2Info=array();
		$aryAreaName2Info=array();
		foreach($aryAreaList as $key=>$area)
		{
			$url=strtolower($area['url']);
			$aryAreaUrl2Info[$url]=$area;
			$aryAreaId2Info[$area['id']]=$area;
			$areaName=iconv('gbk', 'utf-8//ignore',$area['area']);
			$aryAreaName2Url[$areaName]=$url;
		}
		
		file_put_contents('areaUrl2Info.php', '<?php'."\r\n".'$aryAreaUrl2Info='.var_export ($aryAreaUrl2Info,true).';'."\r\n".'?>'); 
		include_once APP_PATH.'/areaUrl2Info.php';
		print_r($aryAreaUrl2Info);

		file_put_contents('areaId2Info.php', '<?php'."\r\n".'$aryAreaId2Info='.var_export ($aryAreaId2Info,true).';'."\r\n".'?>'); 
		include_once APP_PATH.'/areaId2Info.php';
		print_r($aryAreaId2Info);

		file_put_contents('areaName2Url.php', '<?php'."\r\n".'$aryAreaName2Url='.json_encode
 ($aryAreaName2Url,true).';'."\r\n".'?>'); 
		*/
		

		$conditions=$this->_search();
		
		$sum = $objDoc->findCount($conditions); // 使用了findCount

		$aryTitle=array();
		foreach($this->curNav as $val)
		{
			$aryTitle[]=$val['name'];
		}
		$strTitle=implode('_',$aryTitle);//meta里的标题

		
		$this->sum=$sum;
		
		$this->results = $objDoc->spPager($this->spArgs('page', 1), 5)->findAll($conditions); 
		// 这里获取分页数据并发送到smarty模板内
		$this->pager = $objDoc->spPager()->getPager();
		$this->title=$strTitle;
		$this->display("tpl/docListNew.html");
	}

	function _search()
	{
		$hotKey='';
		$body=$area_id=0;
		$bodyUrl='all';
		$areaUrl='';
		$areaName='全部';
		$srcDoc=$this->spArgs('srcdoc');
		$aryWhere=array();


		if(false==empty($srcDoc))
		{
			$arySrcDoc=explode('_',$srcDoc);
			if(count($arySrcDoc)>2)
			{
				exit('非法url');
			}
			else
			{
				$strFirst=$arySrcDoc[0];
				$strSec=isset($arySrcDoc[1])?$arySrcDoc[1]:'';
				if(array_key_exists($strFirst,$this->aryBodyUrl2Info))
				{
					$body=$this->aryBodyUrl2Info[$strFirst][1];
					$bodyUrl=$strFirst;
				}
				else if(array_key_exists($strFirst,$this->aryAreaUrl2Info))
				{
					$area_id=$this->aryAreaUrl2Info[$strFirst]['id'];
					$areaUrl=$strFirst;
					$areaName=$this->aryAreaUrl2Info[$strFirst]['area'];
				}
				else
				{
					exit('非法url');
				}

				if ($strSec)
				{
					if(array_key_exists($strSec,$this->aryAreaUrl2Info))
					{
						$area_id=$this->aryAreaUrl2Info[$strSec]['id'];
						$areaUrl=$strSec;
						$areaName=$this->aryAreaUrl2Info[$strSec]['area'];
					}
					else
					{
						exit('非法url');
					}
				}

			}
			
		}

		
		if($body)
		{
			$aryWhere[]="concat(',',operations,',') like '%,$body,%'";
			$this->bodyKey=$arySrcDoc[0];
		}
		if($area_id)
		{
			$aryWhere[]="area_id='$area_id'";
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
		$curNav=$this->_getNav($bodyUrl,$areaUrl);
		$this->curNav=$curNav;
		//四个搜索条件的数组
		$this->con1=$this->_getOptionUrl(1,$bodyUrl,$areaUrl);
		$this->con2=$this->_getOptionUrl(2,$bodyUrl,$areaUrl);

		$this->areaName=$areaName;//当前选择的城市名称
		$this->areaUrl=$areaUrl;//当前选择的城市url
		$this->bodyUrl=$bodyUrl;//当前选择的部位
		
		return $strWhere;

	}

	function _getNav($bodyUrl,$areaUrl)
	{
		$tmpNav[]=array('name'=>'整形医生搜索','url'=>$this->srcDocUrl.'/');

		if($bodyUrl!='all')
		{
			$bodyInfo=$this->aryBodyUrl2Info[$bodyUrl];
			$bodyName=$bodyInfo[0];

			$tmpNav[]=array('name'=>$bodyName,'url'=>$this->srcDocUrl.'/'.$bodyUrl.'/');
		}

		if($areaUrl)
		{
			$tmpNav[]=array('name'=>$this->aryAreaUrl2Info[$areaUrl]['area'],'url'=>$this->srcDocUrl.'/'.$areaUrl.'/');
		}

		return $tmpNav;
	}
	
	//获取2个搜索条件的选项
	function _getOptionUrl($type,$bodyUrl,$areaUrl)
	{
		$optionArr=array();
		if($type==1)
		{
			foreach($this->aryBodyUrl2Info as $key=>$value)
			{
				$selected=$key==$bodyUrl?1:0;
				$strSrcdoc=$areaUrl?$key.'_'.$areaUrl:$key;
				$optionArr[]=array('name'=>$value[0],'url'=>$this->srcDocUrl.'/'.$strSrcdoc.'/','selected'=>$selected);
			}
		}
		else if($type==2)
		{
			foreach($this->aryHotCitys as $key=>$value)
			{
				$selected=$value==$areaUrl?1:0;
				$strSrcdoc=$bodyUrl!='all'?$bodyUrl.'_'.$value:$value;
				$optionArr[]=array('name'=>$key,'url'=>$this->srcDocUrl.'/'.$strSrcdoc.'/','selected'=>$selected);
			}
		}
		return $optionArr;
	}



	//获取医生的两个搜索字段组成的导航
	function _getDocNav($body,$area_id)
	{
		$aryNav=$bodyNav=$areaNav=array();
		$aryNav[]=array(array('name'=>'整形医生搜索','url'=>$this->topSrcDocUrl));

		foreach(explode(',',$body) as $key)
		{
			$bodyNav[]=array('name'=>$this->aryBodyId2Info[$key][1],'url'=>$this->topSrcDocUrl.'#srcdoc/'.$this->aryBodyId2Info[$key][0].'/');
		}
		$aryNav[]=$bodyNav;
		
		$areaNav[]=array('name'=>$this->aryAreaId2Info[$area_id]['area'],'url'=>$this->topSrcDocUrl.'#srcdoc/'.strtolower($this->aryAreaId2Info[$area_id]['url']).'/');
		
		$aryNav[]=$areaNav;

		return $aryNav;
	}



	function view()
	{
		$objDoc=spClass("m_doctor");
		$condition=array('doctor_id'=>intval($this->spArgs('id')));
		$detail=$objDoc->find($condition);
		if(false==$detail)
		{
			exit('该医生不存在');
		}
		$areaname=$this->aryAreaId2Info[$detail['area_id']]['area'];
		$strAjaxArea=$areaname;
	
		$this->result=$detail;

		$this->nav=$this->_getDocNav($detail['operations'],$detail['area_id']);

		//获取该项目的头5名医生

		$strAreaWhere=" area_id='{$detail['area_id']}'";//医生所在地区条件

		$strOperWhere='';
		if($detail['operations'])
		{
			$aryTmp=array();
			foreach(explode(',',$detail['operations']) as $opera)
			{
				$aryTmp[]="concat(',',operations,',') like '%,$opera,%'";
			}

			$strOperWhere=' AND ('.implode(' OR ',$aryTmp).') '; //医生擅长项目条件
		}


		$strIgnoreDocId=" AND doctor_id !=".intval($this->spArgs('id'));//排除当前显示的医生id

		$strWhere=' WHERE '.$strAreaWhere.$strOperWhere.$strIgnoreDocId;
		
		$aryDocList=$objDoc->findSql('SELECT doctor_id,doctor_name,job_titles,doctor_pict FROM doctor '.$strWhere.' order by rand() limit 5'); 
	
		if(false==$aryDocList)
		{
			$aryDocList=$objDoc->findSql('SELECT doctor_id,doctor_name,job_titles,doctor_pict FROM doctor WHERE '.$strAreaWhere.$strIgnoreDocId.' order by rand() limit 5');
		}

		if(false==$aryDocList)
		{
			$aryDocList=$objDoc->findSql('SELECT doctor_id,doctor_name,job_titles,doctor_pict FROM doctor WHERE '.str_replace(' AND ','',$strIgnoreDocId).' order by rand() limit 5');
			$strAjaxArea='全部';
		}

		$this->docs=$aryDocList;
		$this->strAjaxArea=$strAjaxArea;
		$this->display("tpl/docDetailNew.html");
	}

	function getAjaxDoc()
	{
		header('Content-Type: text/html; charset=gbk');
		$cityUrl=$this->spArgs('cityurl');
		if(array_key_exists($cityUrl,$this->aryAreaUrl2Info))
		{
			$cityId=$this->aryAreaUrl2Info[$cityUrl]['id'];
		}
		else
		{
			$cityId=0;
		}

		$operas=$this->spArgs('operas');
		$operas=isset($operas)?unescape($operas):'';
		
		$aryWhere=array();
		$strOperaWhere='';
		
		if($operas)
		{
			$aryOpera=array();
			
			foreach(explode(',',$operas) as $opera)
			{
				$aryOpera[]="concat(',',operations,',') like '%,$opera,%'";
			}
			$strOperaWhere=implode(' OR ',$aryOpera);
		}

		if($cityId)
		{
			$aryWhere[]=' area_id='.$cityId;
			if($strOperaWhere)
			{
				$aryWhere[]='('.$strOperaWhere.')';
			}
		}
		else
		{
			if($strOperaWhere)
			{
				$aryWhere[]=$strOperaWhere;
			}
		}

		$strWhere=" WHERE ".implode(' AND ',$aryWhere);

		//获取该项目的头5名医生
		$objDoc=spClass("m_doctor");
				
		$aryDocList=$objDoc->findSql('SELECT doctor_id,doctor_name,job_titles,doctor_pict FROM doctor '.$strWhere.' order by rand() limit 5'); 

		$this->docs=$aryDocList;

		$this->display("tpl/include/ajax_docs.html");

	}
	
}