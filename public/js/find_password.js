/**
 * �һ�����
 *
 * @package safe
 * @author youhongyu, youhongyu@dangdang.com
 * Created on: 2015-12-30
 * 
 */
$(function() {	
	new EidtUserName(goSubmit);
    $('#J_eUserName').placeholder({
        word: '����������/�ǳ�/�ֻ���',
        color: '#999',
        evtType: 'focus',
        zIndex: 20,
        diffPaddingLeft: 3
    });
    //$('#J_eUserName').focus();
    //�����޸� ���������һ���밴�Ŀ����� type ��disable enable
	function disableNextBtn(type){//���û�ȡ������֤�밴�Ŀ����� type ��disable enable
    	if(type=='enable'){
    		$('#J_eUserNameSubmit').show();
            $('#J_eUserNameSubmitUnable').hide();
    	} else {
    		$('#J_eUserNameSubmit').hide();
            $('#J_eUserNameSubmitUnable').show();
    	}
    }
    //��д���˺��Ǵ��ڵģ����������֤ҳ��
	function goSubmit(){
		//��ֹ�ظ��ύ
        disableNextBtn('disable');
		// �ֻ�ע�����������֤����ύ
        $("#username_form").attr("onsubmit","return true;");
        $('#J_submitForm').click();   
	}
	
	//���������ͼ����֤�볬ʱ��10����ת�����Ļ�����Ҫ��ʾͼ����֤��ʧЧ
	var vcodeState = $('#J_vcodeState').val();
	if(vcodeState==='timeout'){
		var formHandler = new FormHandler();
		formHandler.switchInputStyle('error','J_eUserNameCode', 'J_eUserNameCodeTipImg','J_eUserNameCodeTipInfo');
        $('#J_eUserNameCodeTipInfo').html(formHandler.lang_zh['5707']);
        $('#J_vcodeState').val('');
	}
});

