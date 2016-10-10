var GLOBAL = {
		selfHtts: 'https://safe.dangdang.com/',
		httpsJsonpTimeout: 10000 //http Jsonp����ʱʱ��10s
};
var isIE = (document.all) ? true : false;
//var isIE6 = isIE && ([/MSIE (\d)\.0/i.exec(navigator.userAgent)][0][1] == 6);
var $ID = function (id) {
    return "string" == typeof id ? document.getElementById(id) : id;
};
var Class = {
    create: function() {
        return function() { this.initialize.apply(this, arguments);};
    }
};

var Extend = function(destination, source) {
    for (var property in source) {
        destination[property] = source[property];
    }
};

var Bind = function(object, fun) {
    return function() {
        return fun.apply(object, arguments);
    };
};

var BindAsEventListener = function(object, fun) {
    var args = Array.prototype.slice.call(arguments).slice(2);
    return function(event) {
        return fun.apply(object, [event || window.event].concat(args));
    };
};

var CurrentStyle = function(element){
    return element.currentStyle || document.defaultView.getComputedStyle(element, null);
};

function addEventHandler(oTarget, sEventType, fnHandler) {
    if (oTarget.addEventListener) {
        oTarget.addEventListener(sEventType, fnHandler, false);
    } else if (oTarget.attachEvent) {
        oTarget.attachEvent("on" + sEventType, fnHandler);
    } else {
        oTarget["on" + sEventType] = fnHandler;
    }
};

function removeEventHandler(oTarget, sEventType, fnHandler) {
    if (oTarget.removeEventListener) {
        oTarget.removeEventListener(sEventType, fnHandler, false);
    } else if (oTarget.detachEvent) {
        oTarget.detachEvent("on" + sEventType, fnHandler);
    } else { 
        oTarget["on" + sEventType] = null;
    }
};

// �����֤��ʼ��
var Verify = Class.create();
Verify.prototype = {
    initialize: function(options){
        this.verifyEmail = '';//�����֤ ������֤��彻������
        this.verifyPhone = '';//�����֤ �ֻ���֤��彻������
        this.verifyPhoneUnknow = '';//�������� �����֤ �����ֻ��Ž����ֻ���֤ ��彻������
        this.verifyPayPass = ''; //�����֤ ֧��������֤��彻������
        this.options = {
            errorCode: 0,
            verifyType:{
            	phoneUnknow: {errorCode: 0, vname: "phone", vtext: "�ֻ���֤", value: "",
                	hasTopTip: "false",topTipName: "",
                	hasBottomTip: "true",bottomTipName: "J_tempPhoneTip", tempId:"J_tempPhoneUnknow"},
            	phone: {errorCode: 0, vname: "phone", vtext: "�ֻ���֤", value: "",
                    	hasTopTip: "false",topTipName: "",
                    	hasBottomTip: "true",bottomTipName: "J_tempPhoneTip", tempId:"J_tempPhone"},
	            payPass: {errorCode: 0, vname: "payPass", vtext: "֧��������֤", value: "",
	                    hasTopTip: "false",topTipName: "",
	                    hasBottomTip: "false",bottomTipName: "", tempId:"J_tempPaypass"},
	            email: {errorCode: 0, vname: "email", vtext: "������֤", value: "",
	                    hasTopTip: "false",topTipName: "",
	                    hasBottomTip: "true",bottomTipName: "J_tempEmailTip", tempId:"J_tempEmail"}               
            },
            showVerify:["phone","payPass","email"],//���ṩ��������֤����
            showVerifyLen: 3,
            defualtValue: "phone",
            callback: {}
        };
        Extend(this.options, options || {});
        
        //��ӡ�����֤�����Ϣ
        var $verifyTypeWrapWrap = $('#J_verifyTypeWrapWrap');
	    var verifyPan = $('#J_tempVerifyPan').html();
	    var compiledSet1 = juicer(verifyPan);
	    $verifyTypeWrapWrap.html(compiledSet1.render(this.options));
	    //���ó�ʼ����֤����
	    if(this.options.showVerifyLen == 1){//ֻ��һ����֤��ʽʱ��ֱ�Ӵ�ӡ ��֤��д���
	    	this.printVerifyContent(this.options.defualtValue);
	    }else {//������֤��ʽ  ����Ĭ��ѡ���һ����֤��ʽ����������֤��д���
	    	this.setValue(this.options.defualtValue);
	    }
	    
	    var that = this;
	    //��֤���������б�������
	    $('.j_verifyTypeWrap').on('mouseover',function(){
	    	that.switchVerifySel('show');
	    });
	    $('.j_verifyTypeWrap').on('mouseout',function(){
	    	that.switchVerifySel('hide');
	    });
	    //�л�����ѡ��
	    $('.j_verifyType').on('click', function(){
	        var verifyValue = $(this).attr('data-value');
	        that.setValue(verifyValue);
	        that.switchVerifySel('hide');
	    });
    },
    //�л���֤��ʽ
	switchVerifySel: function(type){
	    if(type == 'show'){
	        $('#J_verifyTypeIcon').removeClass('down').addClass('up');
            $('#J_verifyTypeList').show();
	    }else if(type== 'hide'){
	        $('#J_verifyTypeIcon').removeClass('up').addClass('down');
            $('#J_verifyTypeList').hide();
	    }
	},
	getValue: function(){
	    return $('#J_verifyTypeValue').attr('data-value');
	},
	setValue: function(vname){
	    var text = $('.j_verifyType[data-value=' + vname + ']').text();
	    $('#J_verifyTypeValue').attr('data-value', vname).text(text);
	    this.printVerifyContent(vname);
	},
	printVerifyContent: function(verifyType){
	    var $verifyPan = $('#J_verifyContentPan');
        var $verifyTopTip = $('#J_verifyTopTip');
        var $verifyBottomTip = $('#J_verifyBottomTip');
        var verifyInfo = '';
        var dataInfo = this.options.verifyType[verifyType];
        
        verifyInfo = $('#' + dataInfo.tempId).html();
        var compiledSet1 = juicer(verifyInfo);
        $verifyPan.html(compiledSet1.render(dataInfo));
        //������֤�����Ԫ�ش���ʱ��
        if(verifyType=='email'){
            if(!this.verifyEmail){
                this.verifyEmail = new VerifyEmail(this.options.callback);
            }else{
                this.verifyEmail.initVerify();
            }
        }else if(verifyType == 'phone'){
            if(!this.verifyPhone ){
                this.verifyPhone = new VerifyPhone(this.options.callback);
            }else{
                this.verifyPhone.initVerify();
            }
        }else if(verifyType == 'phoneUnknow'){
            if(!this.verifyPhoneUnknow ){
                this.verifyPhoneUnknow = new verifyPhoneUnknow(this.options.callback);
            }else{
                this.verifyPhoneUnknow.initVerify();
            }
        }else if(verifyType == 'payPass'){        
            if(!this.verifyPayPass){
                this.verifyPayPass = new VerifyPayPass(this.options.callback);
            }else{
                this.verifyPayPass.initVerify();
            }
        }
        //��ʾ�����֤��ʾ��Ϣ
        if(dataInfo.hasTopTip=="true"){
            $verifyTopTip.html(juicer($('#' + dataInfo.topTipName ).html()).render());
        }else{
            $verifyTopTip.html(''); 
        }
        if(dataInfo.hasBottomTip=="true"){
            $verifyBottomTip.html(juicer($('#' + dataInfo.bottomTipName).html()).render());
        }else{
            $verifyBottomTip.html('');
        }
	}	
};
//�������룬�˻��Ѱ��ֻ�����д�û���Ϊ���ֻ��������彻��
var verifyPhoneUnknow = Class.create();
verifyPhoneUnknow.prototype = {
    initialize: function(callback) {
        this.callback = callback || {};
        this.phoneIsOk = false; //�ֻ��ſ��ñ�ʶ
        this.getMoblieCodeInterval = 120; //�����»�ȡ�ֻ���֤��ʱ���� ��λ��

        this.formHandler = new FormHandler();
        this.formHandler.getCodeBtn = 'J_getVPhoneUnknowCode';//��ȡ��֤�밴ťid
        this.formHandler.unGetCodeBtn = 'J_unGetVPhoneUnknowCode';//��ʾ����ʱ��ťid
        this.formHandler.tipId = 'J_vPhoneUnknowCodeTipInfo';//��ʾ��ȡ��֤�������Ϣid
        this.initVerify();
        this.lastInputPhone = '';//�ϴ�������ֻ��š�        
    },
    initVerify: function() {
        //������꽹�����������ʱ��ʾ��Ϣ
        $('#J_vPhoneUnknow').on('focus', {"obj": this, "callback": this.checkPhoneFocus}, this.formHandler.exeEventHandler);
        //�������ʧȥ����ʱ�����ʾ��Ϣ
        $('#J_vPhoneUnknow').on('blur', {"obj": this, "callback": this.checkPhoneBlur}, this.formHandler.exeEventHandler);
        //������꽹�����������ʱ��ʾ��Ϣ
        $('#J_vPhoneUnknowCode').on('focus', {"obj": this, "callback": this.checkPhoneCodeFocus}, this.formHandler.exeEventHandler);
        //�������ʧȥ����ʱ�����ʾ��Ϣ
        $('#J_vPhoneUnknowCode').on('blur', {"obj": this, "callback": this.checkPhoneCodeBlur}, this.formHandler.exeEventHandler);

        //��ȡ������֤��
        $('#J_getVPhoneUnknowCode').on('click', {"obj": this, "callback": this.getPhoneCode}, this.formHandler.exeEventHandler);
        //�ύ������֤ǰ���ж�����֤����֤
        $('#J_vPhoneUnknowSubmit').on('click', {"obj": this, "callback": this.checkIsOk}, this.formHandler.exeEventHandler);
    },
    checkPhoneFocus: function() {
        this.formHandler.switchInputStyle('normal', 'J_vPhoneUnknow', 'J_vPhoneUnknowTipImg', 'J_vPhoneUnknowTipInfo');
        $('#J_vPhoneUnknow').addClass('active');
        $('#J_vPhoneUnknowTipInfo').html(this.formHandler.lang_zh['5111']);
    },
    checkPhoneBlur: function() {
        var obj = this;
        this.phoneIsOk = false;

        $('#J_vPhoneUnknow').removeClass('active');
        var ePhone = $.trim($('#J_vPhoneUnknow').val());
        if (ePhone == '') {
            this.formHandler.switchInputStyle('error', 'J_vPhoneUnknow', 'J_vPhoneUnknowTipImg', 'J_vPhoneUnknowTipInfo');
            $('#J_vPhoneUnknowTipInfo').html(this.formHandler.lang_zh['5111']);
            //ֹͣ��ȡ��֤�밴ť����ʱ  ��ȡ������֤�밴ť������
            this.clearCodeBtnTimeout('disable');
            this.lastInputPhone = ePhone;
            return false;
        }
        if (!this.formHandler.mobileReg.test(ePhone)) {
            this.formHandler.switchInputStyle('error', 'J_vPhoneUnknow', 'J_vPhoneUnknowTipImg', 'J_vPhoneUnknowTipInfo');
            $('#J_vPhoneUnknowTipInfo').html(this.formHandler.lang_zh['5402']);
            //ֹͣ��ȡ��֤�밴ť����ʱ  ��ȡ������֤�밴ť������
            this.clearCodeBtnTimeout('disable');
            this.lastInputPhone = ePhone;
            return false;
        }
        if (this.lastInputPhone !== ePhone) {
            //ֹͣ��ȡ��֤�밴ť����ʱ  ��ȡ������֤�밴ť������
            this.clearCodeBtnTimeout('disable');
        }
        //��֤������ֻ����Ƿ����˻��󶨵��ֻ���
        obj.phoneIsOk = true;
        $('#J_vPhoneUnknowTipInfo').html('');
        obj.switchGetCodeBtn('enable', obj.formHandler.lang_zh['5003']);//����ȡ��֤�밴ť�л�Ϊ����״̬
    },
    checkPhoneCodeFocus: function() {
        this.formHandler.switchInputStyle('normal', 'J_vPhoneUnknowCode', 'J_vPhoneUnknowCodeTipImg', 'J_vPhoneUnknowCodeTipInfo');
        $('#J_vPhoneUnknowCode').addClass('active');
        $('#J_vPhoneUnknowCodeTipInfo').html(this.formHandler.lang_zh['5101']);
    },
    checkPhoneCodeBlur: function() {
        $('#J_vPhoneUnknowCode').removeClass('active');
        $('#J_vPhoneUnknowCodeTipInfo').html('');
    },
    //��ȡ������֤��
    getPhoneCode: function() {
        var obj = this;
        var mobile = $.trim($('#J_vPhoneUnknow').val());
        obj.switchGetCodeBtn('disable', obj.formHandler.lang_zh['5002']);//��Ӱ�ť����Ч��

        //����ƴ��
        var params = {};
        params.verify_type = 14;//14-�ֻ��Ŷ�����֤
        params.txtMobile = mobile;
        //δ��¼״̬��Ҫ��ͼ����֤��   ���һ�������ֻ�ʱ����Ҫ����ͼ����֤��        
        var $unloginVcode = $('#J_unloginVcode');
        var $unloginUser = $('#J_unloginUser');
        if ($unloginVcode.length > 0) {
            params.txtVcode = $unloginVcode.val();
        }
        if ($unloginUser.length > 0) {
            params.txtUser = $unloginUser.val();
        }

        // ���ֻ�������֤��
        $.ajax({
            type: 'POST',
            url: 'p/send_mobile_vcode.php',
            data: params,
            async: false,
            cache: false,
            success: function(flg) {
                $('#J_errorCode').val(flg);
                if (flg === '0') {//���ŷ��ͳɹ�
                    // ��ʱ����ʼ��
                    obj.formHandler.miao = obj.getMoblieCodeInterval;
                    obj.formHandler.changejishi();
                    // �����֤������� �� ��ʾ��Ϣ��������궨λ����֤�������
                    obj.formHandler.switchInputStyle('normal', 'J_vPhoneUnknowCode', 'J_vPhoneUnknowCodeTipImg', 'J_vPhoneUnknowCodeTipInfo');
                    $('#J_vPhoneUnknowCode').val('');
                    $('#J_vPhoneUnknowCodeTipInfo').html(obj.formHandler.lang_zh['5103']);
                    return true;
                } else if (flg === '1005') {//120�����ظ�����
                    // ���η��ͼ������2����
                    obj.formHandler.switchInputStyle('error', 'J_vPhoneUnknowCode', 'J_vPhoneUnknowCodeTipImg', 'J_vPhoneUnknowCodeTipInfo');
                    $('#J_vPhoneUnknowCodeTipInfo').html(obj.formHandler.lang_zh['5104']);
                    obj.switchGetCodeBtn('enable');
                    return false;
                } else if (flg === '1004' || flg === '1007') {//����ָ������
                    // ���췢�Ͷ��ŵĴ��������˹涨��������
                    obj.formHandler.switchInputStyle('error', 'J_vPhoneUnknowCode', 'J_vPhoneUnknowCodeTipImg', 'J_vPhoneUnknowCodeTipInfo');
                    $('#J_vPhoneUnknowCodeTipInfo').html(obj.formHandler.lang_zh['5105']);
                    obj.switchGetCodeBtn('disable', obj.formHandler.lang_zh['5003']);
                    return false;
                } else if (flg === '1006') {//ͬһip����ָ������
                    // ���췢�Ͷ��ŵĴ��������˹涨��������
                    obj.formHandler.switchInputStyle('error', 'J_vPhoneUnknow', 'J_vPhoneUnknowTipImg', 'J_vPhoneUnknowTipInfo');
                    $('#J_vPhoneUnknowCodeTipInfo').html(obj.formHandler.lang_zh['5109']);
                    obj.disableCodeBtn('enable');
                    return false;
                } else if (flg === '1008') {//�û������ֻ��Ų����˻��󶨵��ֻ���
                    // �������룬�����֤�����û�������ֻ��ź��˻��Ѱ󶨵��ֻ��Ų�ƥ��
                    obj.formHandler.switchInputStyle('error', 'J_vPhoneUnknow', 'J_vPhoneUnknowTipImg', 'J_vPhoneUnknowTipInfo');
                    $('#J_vPhoneUnknowTipInfo').html(obj.formHandler.lang_zh['5110']);
                    obj.switchGetCodeBtn('disable', obj.formHandler.lang_zh['5003']);
                    return false;
                } else if (flg === '1002') {//���ֻ����ѱ���֤�����»�һ��
                    obj.formHandler.switchInputStyle('error', 'J_vPhoneUnknow', 'J_vPhoneUnknowTipImg', 'J_vPhoneUnknowTipInfo');
                    $('#J_vPhoneUnknowTipInfo').html(obj.formHandler.lang_zh['5403']);//�ֻ������ԭ����һ�� TODO
                    obj.switchGetCodeBtn('disable', obj.formHandler.lang_zh['5003']);
                    return false;
                } else if (flg === '1001') {//δ��¼
                    window.location.href = $('#J_returnUrl').val();
                    return false;
                } else if (flg === '1010') {//ͼ����֤����� ��ת���һ������һ��ҳ��
                    window.location.href = '/find_password.php?vcodeState=timeout&txtUser=' + $unloginUser.val();
                    return false;
                } else {
                    //����ԭ��ʧ��
                    obj.formHandler.switchInputStyle('error', 'J_vPhoneUnknowCode', 'J_vPhoneUnknowCodeTipImg', 'J_vPhoneUnknowCodeTipInfo');
                    $('#J_vPhoneUnknowCodeTipInfo').html(obj.formHandler.lang_zh['5001']);
                    obj.switchGetCodeBtn('enable');
                    return false;
                }
            }
        });
    },
    checkIsOk: function() {
        //this.checkPhoneBlur();
        var ePhone = $.trim($('#J_vPhoneUnknow').val());
        var ePhoneCode = $.trim($('#J_vPhoneUnknowCode').val());
        if (ePhone == '') {//�ֻ���δ����
            this.formHandler.switchInputStyle('error', 'J_vPhoneUnknow', 'J_vPhoneUnknowTipImg', 'J_vPhoneUnknowTipInfo');
            $('#J_vPhoneUnknowTipInfo').html(this.formHandler.lang_zh['5111']);
            return false;
        }
        if (!this.phoneIsOk) {//�ֻ��Ÿ�ʽ����ȷ �� �Ѵ���
            this.formHandler.switchInputStyle('error', 'J_vPhoneUnknow', 'J_vPhoneUnknowTipImg', 'J_vPhoneUnknowTipInfo');
            $('#J_vPhoneUnknowTipInfo').html(this.formHandler.lang_zh['5402']);
            return false;
        }

        if (ePhoneCode == '') {
            this.formHandler.switchInputStyle('error', 'J_vPhoneUnknowCode', 'J_vPhoneUnknowCodeTipImg', 'J_vPhoneUnknowCodeTipInfo');
            $('#J_vPhoneUnknowCodeTipInfo').html(this.formHandler.lang_zh['5101']);
            return false;
        }
        if (ePhoneCode.length != 6) {
            this.formHandler.switchInputStyle('error', 'J_vPhoneUnknowCode', 'J_vPhoneUnknowCodeTipImg', 'J_vPhoneUnknowCodeTipInfo');
            $('#J_vPhoneUnknowCodeTipInfo').html(this.formHandler.lang_zh['5102']);
            return false;
        }
        var params = {};
        params.verify_type = 14;//14-��ȫ���������֤��ʽΪ�ֻ�
        params.txtMobile = ePhone;
        params.txtSmsVcode = ePhoneCode;
        //δ��¼״̬��Ҫ��ͼ����֤��   ���һ�����ʹ���ֻ���֤��ݻ��߰��ֻ�ʱ����Ҫ����ͼ����֤��        
        var $unloginUser = $('#J_unloginUser');
        if ($unloginUser.length > 0) {
            params.txtUser = $unloginUser.val();
        }
        var obj = this;
        //��֤������֤����ȷ��
        $.ajax({
            type: 'POST',
            url: 'p/check_mobile_vcode.php',
            data: params,
            async: false,
            cache: false,
            success: function(flg) {
                $('#J_errorCode').val(flg);
                //flg = 0;//TODO
                if (flg === '0') {
                    obj.formHandler.switchInputStyle('ok', 'J_vPhoneUnknowCode', 'J_vPhoneUnknowCodeTipImg', 'J_vPhoneUnknowCodeTipInfo');
                    if (typeof obj.callback == 'function') {
                        obj.callback();
                    }
                    return true;
                } else if (flg === '1003') {//��֤����֤ʧ��
                    obj.formHandler.switchInputStyle('error', 'J_vPhoneUnknowCode', 'J_vPhoneUnknowCodeTipImg', 'J_vPhoneUnknowCodeTipInfo');
                    $('#J_vPhoneUnknowCodeTipInfo').html(obj.formHandler.lang_zh['5102']);
                    return false;
                } else if (flg === '1001') { //δ��¼
                    window.location.href = $('#J_returnUrl').val();
                    return false;
                } else { //�ӿڻ�ϵͳ�쳣
                    obj.formHandler.switchInputStyle('error', 'J_vPhoneUnknowCode', 'J_vPhoneUnknowCodeTipImg', 'J_vPhoneUnknowCodeTipInfo');
                    $('#J_vPhoneUnknowCodeTipInfo').html(obj.formHandler.lang_zh['5001']);
                    return false;
                }
            },
            error: function() {
                return false;
            }
        });
    },
    switchGetCodeBtn: function(type, tipText) {
        if (type === "enable") {
            $('#J_getVPhoneUnknowCode').show();
            $('#J_unGetVPhoneUnknowCode').hide().html();
        } else {
            $('#J_getVPhoneUnknowCode').hide();
            $('#J_unGetVPhoneUnknowCode').show().html(tipText);
        }
    },
    clearCodeBtnTimeout: function(type) {
        //ֹͣ��ȡ��֤�밴ť����ʱ
        clearTimeout(this.formHandler.timeoutRun);
        if (type === 'enable') {
            //��ȡ������֤�밴ť����
            this.switchGetCodeBtn('enable');
        } else {
            //��ȡ������֤�밴ť������
            this.switchGetCodeBtn('disable', this.formHandler.lang_zh['5003']);
        }
    }
};
//������֤
var VerifyEmail = Class.create();
VerifyEmail.prototype = {
    initialize: function(callback){
        this.callback = callback || {};
        this.getMoblieCodeInterval = 120; //�����»�ȡ�ֻ���֤��ʱ���� ��λ��
        
        this.formHandler = new FormHandler(); 
        this.formHandler.getCodeBtn = 'J_getVerifyCode';//��ȡ��֤�밴ťid
        this.formHandler.unGetCodeBtn = 'J_unGetVerifyCode';//��ʾ����ʱ��ťid
        this.formHandler.tipId = 'J_vEmailCodeTipInfo';//��ʾ��ȡ��֤�������Ϣid
        
        this.initVerify();
//        addEventHandler($('#J_vEmailCode')[0], "focus", BindAsEventListener(this, this.checkFocus));
//        addEventHandler($('#J_vEmailCodeSubmit')[0], "click", BindAsEventListener(this, this.checkIsOk));        
    
    },
    initVerify: function(){
        //������꽹�����������ʱ��ʾ��Ϣ
        $('#J_vEmailCode').on('focus', {"obj": this, "callback": this.checkFocus},this.formHandler.exeEventHandler);
        //�������ʧȥ����ʱ�����ʾ��Ϣ
        $('#J_vEmailCode').on('blur', {"obj": this, "callback": this.checkBlur},this.formHandler.exeEventHandler);
        //��ȡ������֤��
        $('#J_getVerifyCode').on('click', {"obj": this, "callback": this.getEmailCode},this.formHandler.exeEventHandler);
        //�ύ������֤ǰ����������֤����֤
        $('#J_vEmailCodeSubmit').on('click', {"obj": this, "callback": this.checkIsOk},this.formHandler.exeEventHandler);
        //��һ����֤��ʽ�л�����һ����֤��ʽ�����л�ʱ��ȡ��֤��ĵ���ʱ����
        if(this.formHandler.miao>0){
            this.formHandler.changejishi();
            $('#J_vEmailCodeTipInfo').html(this.formHandler.lang_zh['5203']);
        }       
    },
    checkFocus: function(){
        this.formHandler.switchInputStyle('normal','J_vEmailCode', 'J_vEmailCodeTipImg','J_vEmailCodeTipInfo');
        $('#J_vEmailCode').addClass('active');
        $('#J_vEmailCodeTipInfo').html(this.formHandler.lang_zh['5201']);
    },
    checkBlur: function(){
        $('#J_vEmailCode').removeClass('active');
        $('#J_vEmailCodeTipInfo').html('');
    },
    //��ȡ������֤��
    getEmailCode: function(){    	
        var obj = this;
        //����ƴ��
        var params = {};
        params.verify_type = 1; //1����ȡ�ʼ���֤��
        //δ��¼״̬��Ҫ��ͼ����֤�� ���˺�����
        var $unloginVcode = $('#J_unloginVcode');
        var $unloginUser = $('#J_unloginUser');
        if($unloginVcode.length>0){
        	params.txtVcode = $unloginVcode.val();
        }
        if($unloginUser.length>0){
        	params.txtUser = $unloginUser.val();
        }
        
        //���ڻ�ȡ��֤��Ƚ�����������ӻ���Ч��
    	$('#J_getVerifyCode').hide();
        $('#J_unGetVerifyCode').show().html(obj.formHandler.lang_zh['5002']);
        $.ajax({
            type: 'POST',
            url: 'p/send_email_vcode.php',
            data: params,
            async: false,
            cache: false,
            success: function (flg) {
            	$('#J_errorCode').val(flg);
                if (flg==0) {
                	// ��ʱ����ʼ��
                    obj.formHandler.miao = obj.getMoblieCodeInterval;
                    obj.formHandler.changejishi();    
                    // �����֤������� �� ��ʾ��Ϣ��������궨λ����֤�������
                    obj.formHandler.switchInputStyle('normal','J_vEmailCode', 'J_vEmailCodeTipImg','J_vEmailCodeTipInfo'); 
                    $('#J_vEmailCode').val('');
                    $('#J_vEmailCodeTipInfo').html(obj.formHandler.lang_zh['5203']);                            
                    // ������֤��ɹ�
                    return true;
                }else if (flg == 1003 || flg == 1004) {
                    // ���췢�Ͷ��ŵĴ��������˹涨��������
                    obj.formHandler.switchInputStyle('error','J_vEmailCode', 'J_vEmailCodeTipImg','J_vEmailCodeTipInfo'); 
                    $('#J_vEmailCodeTipInfo').html(obj.formHandler.lang_zh['5205']);
                    $('#J_getVerifyCode').hide();
                    $('#J_unGetVerifyCode').show().html(obj.formHandler.lang_zh['5207']);
                    return false;
                }else if (flg == 1010) {//ͼ����֤����� ��ת���һ������һ��ҳ��
                	window.location.href = '/find_password.php?vcodeState=timeout&txtUser=' + $unloginUser.val();
                    return false;
                }else {
                    // ϵͳԭ�� ��ӿ��쳣
                    obj.formHandler.switchInputStyle('error','J_vEmailCode', 'J_vEmailCodeTipImg','J_vEmailCodeTipInfo'); 
                    $('#J_vEmailCodeTipInfo').html(obj.formHandler.lang_zh['5001']);
                    $('#J_unGetVerifyCode').hide();
                    $('#J_getVerifyCode').show();                    
                    return false;
                } 
            },
            error: function(){
            	$('#J_unGetVerifyCode').hide();
                $('#J_getVerifyCode').show();
                return false;
            }
        });
    },
    checkIsOk: function(){
        var vEmail = $.trim($('#J_vEmailCode').val());
        if (vEmail == '') {
            this.formHandler.switchInputStyle('error','J_vEmailCode', 'J_vEmailCodeTipImg','J_vEmailCodeTipInfo');
            $('#J_vEmailCodeTipInfo').html(this.formHandler.lang_zh['5201']);
            return false;
        }
        //��֤������֤�� ������֤��Ϊ6λ
        if (vEmail.length != 6) {
            this.formHandler.switchInputStyle('error','J_vEmailCode', 'J_vEmailCodeTipImg','J_vEmailCodeTipInfo');
            $('#J_vEmailCodeTipInfo').html(this.formHandler.lang_zh['5202']);
            return false;
        }
        var obj = this;
        var params = {};
        params.verify_type = 1; 
        params.txtEmailVcode = vEmail;
        //δ��¼״̬��Ҫ���˺�����
        var $unloginUser = $('#J_unloginUser');
        if($unloginUser.length>0){
        	params.txtUser = $unloginUser.val();
        }
        //��ȷ����֤
        $.ajax({
            type: 'POST',
            url: 'p/check_email_vcode.php',
            data: params,
            async: false,
            cache: false,
            success: function (flg) {
            	$('#J_errorCode').val(flg);
            	//flg = 0;//TODO
            	if( flg==='0' ){
            		obj.formHandler.switchInputStyle('ok','J_vEmailCode', 'J_vEmailCodeTipImg','J_vEmailCodeTipInfo');
                	
            		if(typeof obj.callback == 'function'){
                		obj.callback();
                    }
                    return true;
            	} else if( flg==='1002' ){//�ʼ���֤����֤ʧ��
            		obj.formHandler.switchInputStyle('error','J_vEmailCode', 'J_vEmailCodeTipImg','J_vEmailCodeTipInfo');
                    $('#J_vEmailCodeTipInfo').html(obj.formHandler.lang_zh['5202']);
                    return false;
            	} else if(flg === '1001'){//δ��¼
            		window.location.href = $('#J_returnUrl').val();
            	} else{ //�ӿڻ�ϵͳ�쳣
                	obj.formHandler.switchInputStyle('error','J_vEmailCode', 'J_vEmailCodeTipImg','J_vEmailCodeTipInfo');
                    $('#J_vEmailCodeTipInfo').html(obj.formHandler.lang_zh['5001']);
                    return false;
                }
            },
            error: function(){
                return false;
            }
        });        
    }
};
//�ֻ���֤
var VerifyPhone = Class.create();
VerifyPhone.prototype = {
    initialize: function(callback){   
        this.callback = callback || {};    
        this.getMoblieCodeInterval = 120; //�����»�ȡ�ֻ���֤��ʱ���� ��λ��
        
        this.formHandler = new FormHandler();        
        this.formHandler.getCodeBtn = 'J_getVPhoneCode';//��ȡ��֤�밴ťid
        this.formHandler.unGetCodeBtn = 'J_unGetVPhoneCode';//��ʾ����ʱ��ťid
        this.formHandler.tipId = 'J_vPhoneCodeTipInfo';//��ʾ��ȡ��֤�������Ϣid
        this.initVerify();
//        addEventHandler($('#J_vEmailCode')[0], "focus", BindAsEventListener(this, this.checkFocus));
//        addEventHandler($('#J_vEmailCodeSubmit')[0], "click", BindAsEventListener(this, this.checkIsOk));        
          
    },
    initVerify: function(){
        //������꽹�����������ʱ��ʾ��Ϣ
        $('#J_vPhoneCode').on('focus', {"obj": this, "callback": this.checkFocus},this.formHandler.exeEventHandler);
        //�������ʧȥ����ʱ�����ʾ��Ϣ
        $('#J_vPhoneCode').on('blur', {"obj": this, "callback": this.checkBlur},this.formHandler.exeEventHandler);
        //��ȡ������֤��
        $('#J_getVPhoneCode').on('click', {"obj": this, "callback": this.getPhoneCode},this.formHandler.exeEventHandler);
        //�ύ������֤ǰ����������֤����֤
        $('#J_vPhoneCodeSubmit').on('click', {"obj": this, "callback": this.checkIsOk},this.formHandler.exeEventHandler);
        //��һ����֤��ʽ�л�����һ����֤��ʽ�����л�ʱ��ȡ��֤��ĵ���ʱ����
        if(this.formHandler.miao>0){
            this.formHandler.changejishi();
            $('#J_vPhoneCodeTipInfo').html(this.formHandler.lang_zh['5103']);
        }        
    },
    checkFocus: function(){
        this.formHandler.switchInputStyle('normal','J_vPhoneCode', 'J_vPhoneCodeTipImg','J_vPhoneCodeTipInfo');
        $('#J_vPhoneCode').addClass('active');
        $('#J_vPhoneCodeTipInfo').html(this.formHandler.lang_zh['5101']);
    },
    checkBlur: function(){
        $('#J_vPhoneCode').removeClass('active');
        $('#J_vPhoneCodeTipInfo').html('');
    },
    //��ȡ������֤��
    getPhoneCode: function(){
        var obj = this;
        //���ڻ�ȡ��֤��Ƚ�����������ӻ���Ч��
        this.disableCodeBtn('disable', this.formHandler.lang_zh['5002']);
        
        var params = {};
        params.verify_type = 14;        
        //δ��¼״̬��Ҫ��ͼ����֤�� ���˺�����
        var $unloginVcode = $('#J_unloginVcode');
        var $unloginUser = $('#J_unloginUser');
        if($unloginVcode.length>0){
        	params.txtVcode = $unloginVcode.val();
        }
        if($unloginUser.length>0){
        	params.txtUser = $unloginUser.val();
        }
        // ���ֻ�������֤��
        $.ajax({
            type: 'POST',
            url: 'p/send_mobile_vcode.php',
            data: params,
            async: false,
            cache: false,
            success: function (flg) {
            	$('#J_errorCode').val(flg);
                if (flg === '0') { //������֤��ɹ�     
                	// ��ʱ����ʼ��
                    obj.formHandler.miao = obj.getMoblieCodeInterval;
                    obj.formHandler.changejishi();    
                    // �����֤������� �� ��ʾ��Ϣ��������궨λ����֤�������
                    obj.formHandler.switchInputStyle('normal','J_vPhoneCode', 'J_vPhoneCodeTipImg','J_vPhoneCodeTipInfo'); 
                    $('#J_vPhoneCode').val('');
                    $('#J_vPhoneCodeTipInfo').html(obj.formHandler.lang_zh['5103']);
                    return true;
                }else if(flg === '1005'){//120�����ظ�����
            		// ���η��ͼ������2����
                    obj.formHandler.switchInputStyle('error','J_vPhoneCode', 'J_vPhoneCodeTipImg','J_vPhoneCodeTipInfo');  
                    $('#J_vPhoneCodeTipInfo').html(obj.formHandler.lang_zh['5104']);  
                    obj.disableCodeBtn('enable');
                    return false;
            	}else if(flg === '1004' || flg === '1007'){//����ָ������
            		// ���췢�Ͷ��ŵĴ��������˹涨��������
                    obj.formHandler.switchInputStyle('error','J_vPhoneCode', 'J_vPhoneCodeTipImg','J_vPhoneCodeTipInfo'); 
                    $('#J_vPhoneCodeTipInfo').html(obj.formHandler.lang_zh['5105']);
                    obj.disableCodeBtn('disable', obj.formHandler.lang_zh['5003']);
                    return false;
            	}else if(flg === '1006'){//ͳһip����ָ������
            		// ���췢�Ͷ��ŵĴ��������˹涨��������
                    obj.formHandler.switchInputStyle('error','J_vPhoneCode', 'J_vPhoneCodeTipImg','J_vPhoneCodeTipInfo'); 
                    $('#J_vPhoneCodeTipInfo').html(obj.formHandler.lang_zh['5109']);
                    obj.disableCodeBtn('enable');
                    return false;
            	}else if(flg === '1001'){//δ��¼
            		window.location.href = $('#J_returnUrl').val();
            		return false;
            	}else if (flg === '1010') {//ͼ����֤����� ��ת���һ������һ��ҳ��
            		window.location.href = '/find_password.php?vcodeState=timeout&txtUser=' + $unloginUser.val();
                    return false;
                }else{
            		//����ԭ��ʧ��
                    obj.formHandler.switchInputStyle('error','', '','J_vPhoneCodeTipInfo'); 
                    $('#J_vPhoneCodeTipInfo').html(obj.formHandler.lang_zh['5001']);
                    obj.disableCodeBtn('enable');
                    return false;
            	}
            }
        });
    },
    checkIsOk: function(){
        var vPhone = $.trim($('#J_vPhoneCode').val());
        if (vPhone == '') {
            this.formHandler.switchInputStyle('error','J_vPhoneCode', 'J_vPhoneCodeTipImg','J_vPhoneCodeTipInfo');
            $('#J_vPhoneCodeTipInfo').html(this.formHandler.lang_zh['5101']);
            return false;
        }
        if (vPhone.length != 6) {
            this.formHandler.switchInputStyle('error','J_vPhoneCode', 'J_vPhoneCodeTipImg','J_vPhoneCodeTipInfo');
            $('#J_vPhoneCodeTipInfo').html(this.formHandler.lang_zh['5102']);
            return false;
        }
        var obj = this;
        //��֤������֤����ȷ��
        var params = {};
        params.verify_type = 14;
        params.txtSmsVcode = vPhone;
        //δ��¼״̬��Ҫ���˺�����
        var $unloginUser = $('#J_unloginUser');
        if($unloginUser.length>0){
        	params.txtUser = $unloginUser.val();
        }
        $.ajax({
            type: 'POST',
            url: 'p/check_mobile_vcode.php',
            data: params,//12-���ֻ���д�ĺ���;13-�޸��ֻ���д�ĺ���;
            async: false,
            cache: false,
            success: function (flg) {
            	$('#J_errorCode').val(flg);
            	//flg = 0;//TODO
            	if( flg==='0' ){
            		obj.formHandler.switchInputStyle('ok','J_vPhoneCode', 'J_vPhoneCodeTipImg','J_vPhoneCodeTipInfo');
                	if(typeof obj.callback == 'function'){
                		obj.callback();
                    }
                    return true;
            	} else if( flg==='1003' ){//��֤����֤ʧ��
            		obj.formHandler.switchInputStyle('error','J_vPhoneCode', 'J_vPhoneCodeTipImg','J_vPhoneCodeTipInfo');
                    $('#J_vPhoneCodeTipInfo').html(obj.formHandler.lang_zh['5102']);
                    return false;
            	} else if (flg === '1001') { //δ��¼
            		window.location.href = $('#J_returnUrl').val();
            		return false;
                } else{ //�ӿڻ�ϵͳ�쳣
                	obj.formHandler.switchInputStyle('error','J_vPhoneCode', 'J_vPhoneCodeTipImg','J_vPhoneCodeTipInfo');
                    $('#J_vPhoneCodeTipInfo').html(obj.formHandler.lang_zh['5001']);
                    return false;
                }
            },
            error: function(){
                return false;
            }
        });        
    },
    disableCodeBtn: function(type, disableTip){//���û�ȡ������֤�밴�Ŀ����� type ��disable enable
    	if(type=='enable'){
    		$('#J_getVPhoneCode').show();
            $('#J_unGetVPhoneCode').hide().html('');
    	} else {
    		$('#J_getVPhoneCode').hide();
            $('#J_unGetVPhoneCode').show().html(disableTip);    		
    	}
    }
};
//֧��������֤
var VerifyPayPass = Class.create();
VerifyPayPass.prototype = {
    initialize: function(callback){ 
        this.callback = callback || {};       
        this.formHandler = new FormHandler();
        
//        addEventHandler($('#J_vEmailCode')[0], "focus", BindAsEventListener(this, this.checkFocus));
//        addEventHandler($('#J_vEmailCodeSubmit')[0], "click", BindAsEventListener(this, this.checkIsOk));        
       
        this.initVerify();    
    },
    initVerify: function(){
        //������꽹�����������ʱ��ʾ��Ϣ
        $('#J_vPayPass').on('focus', {"obj": this, "callback": this.checkFocus},this.formHandler.exeEventHandler);
        //�������ʧȥ����ʱ�����ʾ��Ϣ
        $('#J_vPayPass').on('blur', {"obj": this, "callback": this.checkBlur},this.formHandler.exeEventHandler);
        //֧�������Сд��ʾ
        $('#J_vPayPass').on('keypress', {"obj": this, "upperCapsId": "J_vPayPassUpperCase","otherTipIds":["J_vPayPassTipInfo"]},this.formHandler.checkCapslockOpen);
        
        //�ύ������֤ǰ����������֤����֤
        $('#J_vPayPassSubmit').on('click', {"obj": this, "callback": this.checkIsOk},this.formHandler.exeEventHandler);
    },
    checkFocus: function(){
        this.formHandler.switchInputStyle('normal','J_vPayPass', 'J_vPayPassTipImg','J_vPayPassTipInfo');
        $('#J_vPayPass').addClass('active');
        $('#J_vPayPassTipInfo').html(this.formHandler.lang_zh['5301']);
    },
    checkBlur: function(){
        $('#J_vPayPass').removeClass('active');
        $('#J_vPhoneCodeTipInfo').html('');
        $("#J_vPayPassUpperCase").hide();
    },
    checkCapslockOpen: function(e){
        var e= window.event || e;
        var n=e.keyCode || e.which;
        var m=e.shiftKey||(n==16)||false;
        if (((n >= 65 && n <= 90) && !m) || ((n >= 97 && n <= 122 )&& m)) {
            $('#J_vPayPassTipInfo').hide();
            $("#J_vPayPassUpperCase").show();
        } else if(n >= 97 && n <= 122 && !m){
            $("#J_vPayPassUpperCase").hide();
        } else if(n==27){
            $("#J_vPayPassUpperCase").hide();
        } else{
            $("#J_vPayPassUpperCase").hide();
        }
    },
    checkIsOk: function(){
        var vPayPass = $('#J_vPayPass').val();
        if (vPayPass == '') {
            this.formHandler.switchInputStyle('error','J_vPayPass', 'J_vPayPassTipImg','J_vPayPassTipInfo');
            $('#J_vPayPassTipInfo').html(this.formHandler.lang_zh['5301']);
            return false;
        }
        
        var obj = this;
        //��֤֧��������ȷ��
        $.ajax({
            type: 'POST',
            url: GLOBAL.selfHtts + 'p/check_payment_pass.php',
            data: {'txtPayPass': vPayPass},//'txtPayPass=' + escape(vPayPass),
            jsonp: 'jsoncallback',
            dataType: 'jsonp',
            timeout: GLOBAL.httpsJsonpTimeout,
            success: function (res) {
            	var data = res.returnval;
            	var flg = data.flg;            	
            	var enable_cnt = data.enable_cnt;
            	$('#J_errorCode').val(flg);
            	
            	if( flg===0 ){//֧��������֤�ɹ�
            		obj.formHandler.switchInputStyle('ok','J_vPayPass', 'J_vPayPassTipImg','J_vPayPassTipInfo');
                	if(typeof obj.callback == 'function'){
                		obj.callback();
                    }
                    return true;
            	} else if (flg ===1001) { //δ��¼
            		window.location.href = $('#J_returnUrl').val();
            		return false;
                } else if(flg===1002 && enable_cnt!==0){//֧���������
            		obj.formHandler.switchInputStyle('error','J_vPayPass', 'J_vPayPassTipImg','J_vPayPassTipInfo');
            		$('#J_vPayPassTipInfo').html(obj.formHandler.lang_zh['5302'].replace('{#getNumber#}', enable_cnt));
                    return false;
            	} else if(flg===1003 || enable_cnt===0){//֧��������֤�����޶�����
            		obj.formHandler.switchInputStyle('error','J_vPayPass', 'J_vPayPassTipImg','J_vPayPassTipInfo');
            		$('#J_vPayPassTipInfo').html(obj.formHandler.lang_zh['5303']);
                    return false;
            	} else {//�ӿڻ�ϵͳ�쳣
            		obj.formHandler.switchInputStyle('error','J_vPayPass', 'J_vPayPassTipImg','J_vPayPassTipInfo');
                    $('#J_vPayPassTipInfo').html(obj.formHandler.lang_zh['5001']);
                    return false;
            	}
            },
            error: function(){
                return false;
            }
        });        
    }
};
//���ֻ� ��彻��
var EidtPhone = Class.create();
EidtPhone.prototype = {
    initialize: function(callback){
        this.callback = callback || {};
        this.phoneIsOk = false; //�ֻ��ſ��ñ�ʶ
        this.getMoblieCodeInterval = 120; //�����»�ȡ�ֻ���֤��ʱ���� ��λ��
        
        this.formHandler = new FormHandler();
        this.formHandler.getCodeBtn = 'J_getEPhoneCode';//��ȡ��֤�밴ťid
        this.formHandler.unGetCodeBtn = 'J_unGetEPhoneCode';//��ʾ����ʱ��ťid
        this.formHandler.tipId = 'J_ePhoneCodeTipInfo';//��ʾ��ȡ��֤�������Ϣid
        this.initVerify();
        this.lastInputPhone = '';//�ϴ�������ֻ��š�
//        addEventHandler($('#J_vEmailCode')[0], "focus", BindAsEventListener(this, this.checkFocus));
//        addEventHandler($('#J_vEmailCodeSubmit')[0], "click", BindAsEventListener(this, this.checkIsOk));        
          
    },
    initVerify: function(){
        //������꽹�����������ʱ��ʾ��Ϣ
        $('#J_ePhone').on('focus', {"obj": this, "callback": this.checkPhoneFocus},this.formHandler.exeEventHandler);
        //�������ʧȥ����ʱ�����ʾ��Ϣ
        $('#J_ePhone').on('blur', {"obj": this, "callback": this.checkPhoneBlur},this.formHandler.exeEventHandler);
        //������꽹�����������ʱ��ʾ��Ϣ
        $('#J_ePhoneCode').on('focus', {"obj": this, "callback": this.checkPhoneCodeFocus},this.formHandler.exeEventHandler);
        //�������ʧȥ����ʱ�����ʾ��Ϣ
        $('#J_ePhoneCode').on('blur', {"obj": this, "callback": this.checkPhoneCodeBlur},this.formHandler.exeEventHandler);
        
        //��ȡ������֤��
        $('#J_getEPhoneCode').on('click', {"obj": this, "callback": this.getPhoneCode},this.formHandler.exeEventHandler);
        //�ύ������֤ǰ����������֤����֤
        $('#J_ePhoneSubmit').on('click', {"obj": this, "callback": this.checkIsOk},this.formHandler.exeEventHandler);
    },
    checkPhoneFocus: function(){
        this.formHandler.switchInputStyle('normal','J_ePhone', 'J_ePhoneTipImg','J_ePhoneTipInfo');
        $('#J_ePhone').addClass('active');
        $('#J_ePhoneTipInfo').html(this.formHandler.lang_zh['5401']);
    },
    checkPhoneBlur: function(){
    	this.phoneIsOk = false;
    	
        $('#J_ePhone').removeClass('active');
        var ePhone = $.trim($('#J_ePhone').val());
        if (ePhone == '') {
            this.formHandler.switchInputStyle('error','J_ePhone', 'J_ePhoneTipImg','J_ePhoneTipInfo');
            $('#J_ePhoneTipInfo').html(this.formHandler.lang_zh['5401']);
            if(this.lastInputPhone !== ePhone){
        		//ֹͣ��ȡ��֤�밴ť����ʱ  ��ȡ������֤�밴ť������
            	this.clearCodeBtnTimeout('disable');                  	                  	               
            }
            this.lastInputPhone = ePhone;
            return false;
        }
        if (!this.formHandler.mobileReg.test(ePhone)) {
            this.formHandler.switchInputStyle('error','J_ePhone', 'J_ePhoneTipImg','J_ePhoneTipInfo');          
            $('#J_ePhoneTipInfo').html(this.formHandler.lang_zh['5402']);
            if(this.lastInputPhone !== ePhone){
        		//ֹͣ��ȡ��֤�밴ť����ʱ  ��ȡ������֤�밴ť������
            	this.clearCodeBtnTimeout('disable');                  	                  	               
            }
            this.lastInputPhone = ePhone;
            return false;
        }
        
        //����ƴ��
        var params = {};
        params.txtUser = ePhone;
        //δ��¼״̬��Ҫ��ͼ����֤��   ���һ�������ֻ�ʱ����Ҫ����ͼ����֤��
        var $unloginVcode = $('#J_unloginVcode');
        var $unloginUser = $('#J_unloginUser');
        if($unloginVcode.length>0){
        	params.txtVcode = $unloginVcode.val();
        }
        
        //��֤�绰�Ƿ��ѱ�ʹ�ù�
        var obj = this;
        $.ajax({
            type: 'POST',
            url: 'p/check_username_exist.php',
            data: params,
            async: false,
            success: function (flg) {
            	$('#J_errorCode').val(flg);
            	if(flg === 'false'){//�ֻ�δ��ʹ�ã����Խ��а�            		
                 	obj.formHandler.switchInputStyle('ok','J_ePhone', 'J_ePhoneTipImg','J_ePhoneTipInfo');                    
                 	obj.phoneIsOk = true;
                 	if(obj.lastInputPhone !== ePhone){
                		//ֹͣ��ȡ��֤�밴ť����ʱ  ��ȡ������֤�밴ť����
                    	obj.clearCodeBtnTimeout('enable');                    	                  	               
                    }
                } else{                	
                	if(obj.lastInputPhone !== ePhone){
                		//ֹͣ��ȡ��֤�밴ť����ʱ  ��ȡ������֤�밴ť������
                		obj.clearCodeBtnTimeout('disable');                  	                  	               
                    }
                	if (flg === 'true') {//�ֻ��Ѵ���
                        obj.formHandler.switchInputStyle('error','J_ePhone', 'J_ePhoneTipImg','J_ePhoneTipInfo');
                        $('#J_ePhoneTipInfo').html(obj.formHandler.lang_zh['5403']);                        
                    } else if(flg === '1001'){//δ��¼
                		window.location.href = $('#J_returnUrl').val();
                		return false;
                	} else if(flg === '2001' || flg === '3001'){//�ӿ��쳣
                    	obj.formHandler.switchInputStyle('error','J_ePhone', 'J_ePhoneTipImg','J_ePhoneTipInfo');
                        $('#J_ePhoneTipInfo').html(obj.formHandler.lang_zh['5001']);                        
                    } else if (flg === '1010') {//ͼ����֤����� ��ת���һ������һ��ҳ��
                    	window.location.href = '/find_password.php?vcodeState=timeout&txtUser=' + $unloginUser.val();
                        return false;
                    } else{//��������
                    	obj.formHandler.switchInputStyle('error','J_ePhone', 'J_ePhoneTipImg','J_ePhoneTipInfo');
                        $('#J_ePhoneTipInfo').html(obj.formHandler.lang_zh['5001']);
                        
                    }
                }  
            	obj.lastInputPhone = ePhone;
            }//end success end        	
        });//end ajax        
    },
    checkPhoneCodeFocus: function(){
        this.formHandler.switchInputStyle('normal','J_ePhoneCode', 'J_ePhoneCodeTipImg','J_ePhoneCodeTipInfo');
        $('#J_ePhoneCode').addClass('active');
        $('#J_ePhoneCodeTipInfo').html(this.formHandler.lang_zh['5101']);
    },
    checkPhoneCodeBlur: function(){
        $('#J_ePhoneCode').removeClass('active');
        $('#J_ePhoneCodeTipInfo').html('');
    },
    //��ȡ������֤��
    getPhoneCode: function(){    	
    	/*
        //�ֻ�����ȷʱ�����ܺ�ȥ��֤��    	
        if(this.phoneIsOk == false){
        	//��Ҫ����д�ֻ���
            var ePhone = $.trim($('#J_ePhone').val());        
            if (ePhone == '') {
            	$('#J_ePhone').focus();                
            }
            return false;
        }
        */
        var obj = this;
        var mobile = $.trim($('#J_ePhone').val());
        obj.switchGetCodeBtn('disable', obj.formHandler.lang_zh['5002']);
        
        //����ƴ��
        var params = {};
        params.verify_type = $('#J_mobileSendType').val();//12-���ֻ���д�ĺ���;13-�޸��ֻ���д�ĺ���;
        params.txtMobile = mobile;
        //δ��¼״̬��Ҫ��ͼ����֤��   ���һ�������ֻ�ʱ����Ҫ����ͼ����֤��        
        var $unloginVcode = $('#J_unloginVcode');
        var $unloginUser = $('#J_unloginUser');
        if($unloginVcode.length>0){
        	params.txtVcode = $unloginVcode.val();
        }
        if($unloginUser.length>0){
        	params.txtUser = $unloginUser.val();
        }
        
        // ���ֻ�������֤��
        $.ajax({
            type: 'POST',
            url: 'p/send_mobile_vcode.php',
            data: params,
            async: false,
            cache: false,
            success: function (flg) {
            	$('#J_errorCode').val(flg);
            	if (flg === '0'){//���ŷ��ͳɹ�
            		// ��ʱ����ʼ��
                    obj.formHandler.miao = obj.getMoblieCodeInterval;
                    obj.formHandler.changejishi();
                    // �����֤������� �� ��ʾ��Ϣ��������궨λ����֤�������
                    obj.formHandler.switchInputStyle('normal','J_ePhoneCode', 'J_ePhoneCodeTipImg','J_ePhoneCodeTipInfo'); 
                    $('#J_ePhoneCode').val('');
                    $('#J_ePhoneCodeTipInfo').html(obj.formHandler.lang_zh['5103']);
                    return true;
            	}else if(flg === '1005'){//120�����ظ�����
            		// ���η��ͼ������2����
                    obj.formHandler.switchInputStyle('error','J_ePhoneCode', 'J_ePhoneCodeTipImg','J_ePhoneCodeTipInfo'); 
                    $('#J_ePhoneCodeTipInfo').html(obj.formHandler.lang_zh['5104']);  
                    obj.switchGetCodeBtn('enable');
                    return false;
            	}else if(flg === '1004' || flg === '1007'){//����ָ������
            		// ���췢�Ͷ��ŵĴ��������˹涨��������
                    obj.formHandler.switchInputStyle('error','J_ePhoneCode', 'J_ePhoneCodeTipImg','J_ePhoneCodeTipInfo'); 
                    $('#J_ePhoneCodeTipInfo').html(obj.formHandler.lang_zh['5105']);
                    obj.switchGetCodeBtn('disable', obj.formHandler.lang_zh['5003']);
                    return false;
            	}else if(flg === '1006'){//ͳһip����ָ������
            		// ���췢�Ͷ��ŵĴ��������˹涨��������
                    obj.formHandler.switchInputStyle('error','J_ePhone', 'J_ePhoneTipImg','J_ePhoneTipInfo');  
                    $('#J_ePhoneCodeTipInfo').html(obj.formHandler.lang_zh['5109']);
                    obj.disableCodeBtn('enable');
                    return false;
            	}else if(flg === '1002'){//���ֻ����ѱ���֤�����»�һ��
            		obj.formHandler.switchInputStyle('error','J_ePhone', 'J_ePhoneTipImg','J_ePhoneTipInfo'); 
                    $('#J_ePhoneTipInfo').html(obj.formHandler.lang_zh['5403']);//�ֻ������ԭ����һ�� TODO
                    obj.switchGetCodeBtn('disable', obj.formHandler.lang_zh['5003']);
                    return false;
            	}else if(flg === '1001'){//δ��¼
            		window.location.href = $('#J_returnUrl').val();
            		return false;
            	}else if (flg === '1010') {//ͼ����֤����� ��ת���һ������һ��ҳ��
            		window.location.href = '/find_password.php?vcodeState=timeout&txtUser=' + $unloginUser.val();
                    return false;
                }else{
            		//����ԭ��ʧ��
                    obj.formHandler.switchInputStyle('error','J_ePhoneCode', 'J_ePhoneCodeTipImg','J_ePhoneCodeTipInfo'); 
                    $('#J_ePhoneCodeTipInfo').html(obj.formHandler.lang_zh['5001']);
                    obj.switchGetCodeBtn('enable');
                    return false;
            	}               
            }
        });
    },
    checkIsOk: function(){
        //this.checkPhoneBlur();
    	var ePhone = $.trim($('#J_ePhone').val());
        var ePhoneCode = $.trim($('#J_ePhoneCode').val());
        if (ePhone == '') {//�ֻ���δ����
        	this.formHandler.switchInputStyle('error','J_ePhone', 'J_ePhoneTipImg','J_ePhoneTipInfo');
            $('#J_ePhoneTipInfo').html(this.formHandler.lang_zh['5401']);         
            return false;
        }
        if (!this.phoneIsOk) {//�ֻ��Ÿ�ʽ����ȷ �� �Ѵ���
        	this.formHandler.switchInputStyle('error','J_ePhone', 'J_ePhoneTipImg','J_ePhoneTipInfo');          
            $('#J_ePhoneTipInfo').html(this.formHandler.lang_zh['5402']);          
            return false;
        }
        
        if (ePhoneCode == '') {
            this.formHandler.switchInputStyle('error','J_ePhoneCode', 'J_ePhoneCodeTipImg','J_ePhoneCodeTipInfo');
            $('#J_ePhoneCodeTipInfo').html(this.formHandler.lang_zh['5101']);
            return false;
        }
        if (ePhoneCode.length != 6) {
            this.formHandler.switchInputStyle('error','J_ePhoneCode', 'J_ePhoneCodeTipImg','J_ePhoneCodeTipInfo');
            $('#J_ePhoneCodeTipInfo').html(this.formHandler.lang_zh['5102']);
            return false;
        }
        var params = {};
        params.verify_type = $('#J_mobileSendType').val();
        params.txtMobile = ePhone;
        params.txtSmsVcode = ePhoneCode;//12-���ֻ���д�ĺ���;13-�޸��ֻ���д�ĺ���;
        //δ��¼״̬��Ҫ��ͼ����֤��   ���һ�������ֻ�ʱ����Ҫ����ͼ����֤��        
        var $unloginUser = $('#J_unloginUser');
        if($unloginUser.length>0){
        	params.txtUser = $unloginUser.val();
        }        
        var obj = this;
        //��֤������֤����ȷ��
        $.ajax({
            type: 'POST',
            url: 'p/check_mobile_vcode.php',
            data: params ,
            async: false,
            cache: false,
            success: function (flg) {
            	$('#J_errorCode').val(flg);
            	//flg = 0;//TODO
            	if( flg==='0' ){
            		obj.formHandler.switchInputStyle('ok','J_ePhoneCode', 'J_ePhoneCodeTipImg','J_ePhoneCodeTipInfo');
                	if(typeof obj.callback == 'function'){
                		obj.callback();
                    }
                    return true;
            	} else if( flg==='1003' ){//��֤����֤ʧ��
            		obj.formHandler.switchInputStyle('error','J_ePhoneCode', 'J_ePhoneCodeTipImg','J_ePhoneCodeTipInfo');
                    $('#J_ePhoneCodeTipInfo').html(obj.formHandler.lang_zh['5102']);
                    return false;
            	} else if (flg === '1001') { //δ��¼
            		window.location.href = $('#J_returnUrl').val();
            		return false;
                }else{ //�ӿڻ�ϵͳ�쳣
                	obj.formHandler.switchInputStyle('error','J_ePhoneCode', 'J_ePhoneCodeTipImg','J_ePhoneCodeTipInfo');
                    $('#J_ePhoneCodeTipInfo').html(obj.formHandler.lang_zh['5001']);
                    return false;
                }
            },
            error: function(){
                return false;
            }
        });
    },
    switchGetCodeBtn: function(type ,tipText){
    	if(type == "enable"){
    		$('#J_getEPhoneCode').show();
            $('#J_unGetEPhoneCode').hide().html();
    	} else {
    		$('#J_getEPhoneCode').hide();
            $('#J_unGetEPhoneCode').show().html(tipText);
    	}
    },
    clearCodeBtnTimeout: function(type){
    	//ֹͣ��ȡ��֤�밴ť����ʱ
    	clearTimeout(this.formHandler.timeoutRun); 
    	if(type === 'enable'){    		
        	//��ȡ������֤�밴ť����
        	this.switchGetCodeBtn('enable');                    	                  	               
        } else {
        	//��ȡ������֤�밴ť������
        	this.switchGetCodeBtn('disable', this.formHandler.lang_zh['5003']);
        }
    }
};
//�� ��֤���� ��彻��
var EidtEmail = Class.create();
EidtEmail.prototype = {
    initialize: function(callback){
        this.callback = callback || {};
        this.getMoblieCodeInterval = 120; //�����»�ȡ�ֻ���֤��ʱ���� ��λ��
        
        this.emailIsOk = true;//�������Ƿ����
        
        this.formHandler = new FormHandler();
        this.formHandler.getCodeBtn = 'J_getEEmailCode';//��ȡ��֤�밴ťid
        this.formHandler.unGetCodeBtn = 'J_unGetEEmailCode';//��ʾ����ʱ��ťid
        this.formHandler.tipId = 'J_eEmailCodeTipInfo';//��ʾ��ȡ��֤�������Ϣid
        this.initVerify();
        
        this.lastInputEmail = '';//�ϴ���������䡣
//        addEventHandler($('#J_vEmailCode')[0], "focus", BindAsEventListener(this, this.checkFocus));
//        addEventHandler($('#J_vEmailCodeSubmit')[0], "click", BindAsEventListener(this, this.checkIsOk));        
          
    },
    initVerify: function(){
        //������꽹�����������ʱ��ʾ��Ϣ
        $('#J_eEmail').on('focus', {"obj": this, "callback": this.checkEmailFocus},this.formHandler.exeEventHandler);
        //�������ʧȥ����ʱ�����ʾ��Ϣ
        $('#J_eEmail').on('blur', {"obj": this, "callback": this.checkEmailBlur},this.formHandler.exeEventHandler);
        //������꽹�����������ʱ��ʾ��Ϣ
        $('#J_eEmailCode').on('focus', {"obj": this, "callback": this.checkEmailCodeFocus},this.formHandler.exeEventHandler);
        //�������ʧȥ����ʱ�����ʾ��Ϣ
        $('#J_eEmailCode').on('blur', {"obj": this, "callback": this.checkEmailCodeBlur},this.formHandler.exeEventHandler);
        
        //��ȡ������֤��
        $('#J_getEEmailCode').on('click', {"obj": this, "callback": this.getEmailCode},this.formHandler.exeEventHandler);
        //�ύ������֤ǰ����������֤����֤
        $('#J_eEmailSubmit').on('click', {"obj": this, "callback": this.checkIsOk},this.formHandler.exeEventHandler);
    },
    checkEmailFocus: function(){
        this.formHandler.switchInputStyle('normal','J_eEmail', 'J_eEmailTipImg','J_eEmailTipInfo');
        $('#J_eEmail').addClass('active');
        $('#J_eEmailTipInfo').html(this.formHandler.lang_zh['5501']);
    },
    checkEmailBlur: function(){
    	this.emailIsOk = false;
        $('#J_eEmail').removeClass('active');
        var eEmail = $.trim($('#J_eEmail').val());  
        
        if (eEmail == '') {
            this.formHandler.switchInputStyle('error','J_eEmail', 'J_eEmailTipImg','J_eEmailTipInfo');
            $('#J_eEmailTipInfo').html(this.formHandler.lang_zh['5501']);
            if(this.lastInputEmail !== eEmail){
        		//ֹͣ��ȡ��֤�밴ť����ʱ  ��ȡ������֤�밴ť������
            	this.clearCodeBtnTimeout('disable');                  	                  	               
            }
            this.lastInputEmail = eEmail;
            return false;
        }
        if (eEmail.length > 40 || !this.formHandler.emailReg.test(eEmail)) {
            this.formHandler.switchInputStyle('error','J_eEmail', 'J_eEmailTipImg','J_eEmailTipInfo');          
            $('#J_eEmailTipInfo').html(this.formHandler.lang_zh['5502']);
            if(this.lastInputEmail !== eEmail){
        		//ֹͣ��ȡ��֤�밴ť����ʱ  ��ȡ������֤�밴ť������
            	this.clearCodeBtnTimeout('disable');                  	                  	               
            }
            this.lastInputEmail = eEmail;
            return false;
        }
        if (/[ ]/.test(eEmail)) {
            this.formHandler.switchInputStyle('error','J_eEmail', 'J_eEmailTipImg','J_eEmailTipInfo');          
            $('#J_eEmailTipInfo').html(this.formHandler.lang_zh['5502']);
            if(this.lastInputEmail !== eEmail){
        		//ֹͣ��ȡ��֤�밴ť����ʱ  ��ȡ������֤�밴ť������
            	this.clearCodeBtnTimeout('disable');                  	                  	               
            }
            this.lastInputEmail = eEmail;
            return false;
        }
        //��֤�Ƿ��ѱ�ʹ�ù�
        var obj = this;
        var opType = $('#J_opType').val();
        $.ajax({
            type: 'POST',
            url: 'p/check_username_exist.php',
            data: 'txtUser=' + eEmail + 'opType=' + opType,
            async: false,
            success: function (flg) {
            	$('#J_errorCode').val(flg);
            	if(flg === 'false'){//�ֻ�δ��ʹ�ã����Խ��а�
                 	obj.formHandler.switchInputStyle('ok','J_eEmail', 'J_eEmailTipImg','J_eEmailTipInfo');
                 	obj.emailIsOk = true;//�޸�������ñ�ʶ
                 	if(obj.lastInputEmail !== eEmail){
                		//ֹͣ��ȡ��֤�밴ť����ʱ  ��ȡ������֤�밴ť������
                 		obj.clearCodeBtnTimeout('enable');                  	                  	               
                    }                
                } else {
                	if(obj.lastInputEmail !== eEmail){
                		//ֹͣ��ȡ��֤�밴ť����ʱ  ��ȡ������֤�밴ť������
                		obj.clearCodeBtnTimeout('disable');                  	                  	               
                    }
                	if (flg === 'true') {//�����Ѵ���
	                    obj.formHandler.switchInputStyle('error','J_eEmail', 'J_eEmailTipImg','J_eEmailTipInfo');
	                    $('#J_eEmailTipInfo').html(obj.formHandler.lang_zh['5503']);
	                    return false;
	                } else if(flg === '2001' || flg === '3001'){//�ӿ��쳣
	                	obj.formHandler.switchInputStyle('error','J_eEmail', 'J_eEmailTipImg','J_eEmailTipInfo');
	                    $('#J_eEmailTipInfo').html(obj.formHandler.lang_zh['5001']);
	                    return false;
	                } else if(flg === '1001'){//δ��¼
	            		window.location.href = $('#J_returnUrl').val();
	            		return false;
	            	} else{//��������
	                	obj.formHandler.switchInputStyle('error','J_eEmail', 'J_eEmailTipImg','J_eEmailTipInfo');
	                    $('#J_eEmailTipInfo').html(obj.formHandler.lang_zh['5001']);
	                    return false;
	                }
                }
            	obj.lastInputEmail = eEmail;
            }//end success 
        });//end ajax
    },
    checkEmailCodeFocus: function(){
        this.formHandler.switchInputStyle('normal','J_eEmailCode', 'J_eEmailCodeTipImg','J_eEmailCodeTipInfo');
        $('#J_eEmailCode').addClass('active');
        $('#J_eEmailCodeTipInfo').html(this.formHandler.lang_zh['5201']);
    },
    checkEmailCodeBlur: function(){
        $('#J_eEmailCode').removeClass('active');
        $('#J_eEmailCodeTipInfo').html('');
    },
    //��ȡ������֤��
    getEmailCode: function(){
        var obj = this;
        //���ڻ�ȡ��֤��Ƚ�����������ӻ���Ч��
        obj.switchGetCodeBtn('disable', obj.formHandler.lang_zh['5002']);
        //����ƴ��
        var params = {};
        var email = $.trim($('#J_eEmail').val());
        if(email===''){
        	params.verify_type = 1;
        }else{
        	params.verify_type = 2;
        	params.txtEmail = email;
        }
        
        $.ajax({
        	type: 'POST',
            url: 'p/send_email_vcode.php',
            data: params,//1����ȡ�ʼ���֤��
            async: false,
            cache: false,
            success: function (flg) {
            	$('#J_errorCode').val(flg);
                if (flg==='0') {
                	// ��ʱ����ʼ��
                    obj.formHandler.miao = obj.getMoblieCodeInterval;
                    obj.formHandler.changejishi();    
                    // �����֤������� �� ��ʾ��Ϣ��������궨λ����֤�������
                    obj.formHandler.switchInputStyle('normal','J_eEmailCode', 'J_eEmailCodeTipImg','J_eEmailCodeTipInfo');  
                    $('#J_eEmailCode').val('');
                    $('#J_eEmailCodeTipInfo').html(obj.formHandler.lang_zh['5203']);                            
                    // ������֤��ɹ�
                    return true;
                }else if (flg === '1003' || flg === '1004') {
                    // ���췢�Ͷ��ŵĴ��������˹涨��������
                    obj.formHandler.switchInputStyle('error','J_eEmailCode', 'J_eEmailCodeTipImg','J_eEmailCodeTipInfo'); 
                    $('#J_eEmailCodeTipInfo').html(obj.formHandler.lang_zh['5205']);
                    obj.switchGetCodeBtn('disable', obj.formHandler.lang_zh['5207']);
                    return false;
                }else if(flg === '1001'){//δ��¼
            		window.location.href = $('#J_returnUrl').val();
            		return false;
            	}else if(flg === '1002'){//�û���д���������ԭ������ͬ
            		obj.formHandler.switchInputStyle('error','J_eEmail', 'J_eEmailTipImg','J_eEmailTipInfo'); 
                    $('#J_eEmailTipInfo').html(obj.formHandler.lang_zh['5503']);
                    obj.switchGetCodeBtn('enable');  
            	}else {
                    // ϵͳԭ�� ��ӿ��쳣
                    obj.formHandler.switchInputStyle('error','J_eEmailCode', 'J_eEmailCodeTipImg','J_eEmailCodeTipInfo'); 
                    $('#J_eEmailCodeTipInfo').html(obj.formHandler.lang_zh['5001']);
                    obj.switchGetCodeBtn('enable');              
                    return false;
                } 
            },error: function(){
            	obj.switchGetCodeBtn('enable');
                return false;
            },
            complete: function(){
            }
        });         
    },
    checkIsOk: function(){
    	/**
    	 * �÷��������������������
    	 * 1.������,���Ǹ�����Ϊ��֤,�����������ݿ��ṩ,����Ҫ�û���д
    	 * 2.�޸�����,������Ҫ�û���д
    	 * */
    	var eEmailCode = $.trim($('#J_eEmailCode').val());
    	var email = '';
    	$email = $('#J_eEmail');
    	//���䲻���û��ֶ���дʱ������Ҫ��֤������ȷ��
    	if($email.length>0){
    		email = $.trim($email.val());            
            if (email == '') {//����δ����
                this.formHandler.switchInputStyle('error','J_eEmail', 'J_eEmailTipImg','J_eEmailTipInfo');
                $('#J_eEmailTipInfo').html(this.formHandler.lang_zh['5501']);            
                return false;
            }
            if (!this.emailIsOk) {//�����ʽ����ȷ �� �Ѵ���
                this.formHandler.switchInputStyle('error','J_eEmail', 'J_eEmailTipImg','J_eEmailTipInfo');
                $('#J_eEmailTipInfo').html(this.formHandler.lang_zh['5502']);            
                return false;
            }
        }        
        //��֤��֤���ʽ��ȷ��
        if (eEmailCode == '') {
            this.formHandler.switchInputStyle('error','J_eEmailCode', 'J_eEmailCodeTipImg','J_eEmailCodeTipInfo');
            $('#J_eEmailCodeTipInfo').html(this.formHandler.lang_zh['5201']);
            return false;
        }
        if (eEmailCode.length != 6) {
            this.formHandler.switchInputStyle('error','J_eEmailCode', 'J_eEmailCodeTipImg','J_eEmailCodeTipInfo');
            $('#J_eEmailCodeTipInfo').html(this.formHandler.lang_zh['5202']);
            return false;
        }
        
        var obj = this;
        //����ƴ��
        var params = {};
        params.txtEmailVcode = eEmailCode;
        if(email==undefined || email.length==0 ||email==''){
        	params.verify_type = 1;
        }else{
        	params.verify_type = 2;
        	params.txtEmail = email;
        }
        //��ȷ����֤
        $.ajax({
            type: 'POST',
            url: 'p/check_email_vcode.php',
            data: params,
            async: false,
            cache: false,
            dataType:'json',
            success: function (flg) {
            	$('#J_errorCode').val(flg);
            	if( flg===0 ){
            		obj.formHandler.switchInputStyle('ok','J_eEmailCode', 'J_eEmailCodeTipImg','J_eEmailCodeTipInfo');
                	if(typeof obj.callback == 'function'){
                		obj.callback();
                    }
                    return true;
            	} else if( flg===1002 ){//�ʼ���֤����֤ʧ��
            		obj.formHandler.switchInputStyle('error','J_eEmailCode', 'J_eEmailCodeTipImg','J_eEmailCodeTipInfo');
                    $('#J_eEmailCodeTipInfo').html(obj.formHandler.lang_zh['5202']);
                    return false;
            	} else if (flg===1001) { //δ��¼
            		window.location.href = $('#J_returnUrl').val();
            		return false;
                }else{ //�ӿڻ�ϵͳ�쳣
                	obj.formHandler.switchInputStyle('error','J_eEmailCode', 'J_eEmailCodeTipImg','J_eEmailCodeTipInfo');
                    $('#J_eEmailCodeTipInfo').html(obj.formHandler.lang_zh['5001']);
                    return false;
                }
            },
            error: function(){
                return false;
            }
        });
    },
    switchGetCodeBtn: function(type ,tipText){
    	if(type == "enable"){
    		$('#J_getEEmailCode').show();
            $('#J_unGetEEmailCode').hide().html();
    	} else {
    		$('#J_getEEmailCode').hide();
            $('#J_unGetEEmailCode').show().html(tipText);
    	}
    },
    clearCodeBtnTimeout: function(type){
    	//ֹͣ��ȡ��֤�밴ť����ʱ
    	clearTimeout(this.formHandler.timeoutRun); 
    	if(type === 'enable'){    		
        	//��ȡ������֤�밴ť����
        	this.switchGetCodeBtn('enable');                    	                  	               
        } else {
        	//��ȡ������֤�밴ť������
        	this.switchGetCodeBtn('disable', this.formHandler.lang_zh['5003']);
        }
    }
};
//���� ��¼���� ���� �һ� �޸� ��彻��
var EidtPaypass = Class.create();
EidtPaypass.prototype = {
    initialize: function(callback, setPasswordMethod){
        this.callback = callback;
        this.passwordMethod = 'passwrod';
        if(setPasswordMethod && setPasswordMethod==='paypass'){
        	this.passwordMethod = setPasswordMethod;
        }
        this.passwordIsOk = false;
        this.rePasswordIsOK = false;
        this.checkPassStrongData = {
                                    "obj": this, 
                                    "inputId":"J_ePaypass",
                                    "tipImg":"J_ePaypassTipImg",
                                    "tipInfo": "J_ePaypassTipInfo",
                                    "itemWrapId":"J_ePaypassStrongWrap",
                                    "itemIdPrefix":"J_ePaypassStrong",
                                    "itemClass": "j_pwdStrong",
                                    "upperCapsId": "J_ePaypassUpperCase", 
                                    "otherTipIds":["J_ePaypassTipInfo", "J_ePaypassStrongWrap"]
                                   };
        this.formHandler = new FormHandler();
        this.initVerify();
    },
    initVerify: function(){
    	//���������
        //��ȡ����
        $('#J_ePaypass').on('focus', {"obj": this, "callback": this.checkPaypassFocus},this.formHandler.exeEventHandler);
        //��������ʱ��ʵʱ��������ǿ��       
        $('#J_ePaypass').on('keyup', this.checkPassStrongData,this.formHandler.eventCheckPassStrong);
        //�������̴�Сд�л�
        $('#J_ePaypass').on('keypress', {"obj": this, "upperCapsId": "J_ePaypassUpperCase","otherTipIds":["J_ePaypassTipInfo","J_ePaypassStrongWrap"]},this.formHandler.checkCapslockOpen);
        //ʧȥ����ʱ����֤���������
        $('#J_ePaypass').on('blur', {"obj": this, "callback": this.checkPaypassBlur},this.formHandler.exeEventHandler);
        
        //ȷ����������� 
        //��ȡ����
        $('#J_eRePaypass').on('focus', {"obj": this, "callback": this.checkRePaypassFocus},this.formHandler.exeEventHandler);
        //�������̴�Сд�л�
        $('#J_eRePaypass').on('keypress', {"obj": this, "upperCapsId": "J_eRePaypassUpperCase","otherTipIds":["J_eRePaypassTipInfo"]},this.formHandler.checkCapslockOpen);
        //ʧȥ����ʱ����֤���������
        $('#J_eRePaypass').on('blur', {"obj": this, "callback": this.checkRePaypassBlur},this.formHandler.exeEventHandler);
        
        //�ύ������֤ǰ����������֤����֤
        $('#J_eRePaypassSubmit').on('click', {"obj": this, "callback": this.checkIsOk},this.formHandler.exeEventHandler);
    },
    checkPaypassFocus: function(){
        this.formHandler.switchInputStyle('normal','J_ePaypass', 'J_ePaypassTipImg','J_ePaypassTipInfo');
        $('#J_ePaypass').addClass('active');
        $('#J_ePaypassTipInfo').html(this.formHandler.lang_zh['5601']);
//        $('#J_ePaypassUpperCase').hide();
        $('#J_ePaypassStrongWrap').hide(); //����ǿ������
    },
    checkPaypassBlur: function(){
    	this.passwordIsOk = false;
        $('#J_ePaypass').removeClass('active');
        this.formHandler.switchInputStyle('normal','J_ePaypass', 'J_ePaypassTipImg','J_ePaypassTipInfo');
        $('#J_ePaypassStrongWrap').hide();
        $("#J_ePaypassUpperCase").hide();
        $("#J_ePaypassTipInfo").show();
        
        var passwordVal = $('#J_ePaypass').val();
        var passwordLen = passwordVal.length;
        if (passwordLen == 0) {
            return false;
        }
        if (passwordLen < 6 || passwordLen > 20) {
            this.formHandler.switchInputStyle('error','J_ePaypass', 'J_ePaypassTipImg','J_ePaypassTipInfo');
            $('#J_ePaypassTipInfo').html(this.formHandler.lang_zh['5602']);
            return false;
        }
        if (!this.formHandler.passwordReg.test(passwordVal)) {
            this.formHandler.switchInputStyle('error','J_ePaypass', 'J_ePaypassTipImg','J_ePaypassTipInfo');
            $('#J_ePaypassTipInfo').html(this.formHandler.lang_zh['5604']);       
            return false;
        }
        
        for(var i=0;i<passwordLen;i++){
            if(passwordVal.charCodeAt(i)>127){
                this.formHandler.switchInputStyle('error','J_ePaypass', 'J_ePaypassTipImg','J_ePaypassTipInfo');
                $('#J_ePaypassTipInfo').html(this.formHandler.lang_zh['5605']);
                return false; 
            }
        }
        //���ڴ�д״̬�£��뿪�����ʱ����Ҫ��֤����
        if(!this.formHandler.checkPassStrong(this.checkPassStrongData)){
            return false;
        }
        this.passwordIsOk = true;//�����ʽ��ǿ��ʱ�ϸ��
        //��ȷ�����벻Ϊ��ʱ�������޸ĺ���һ����֤ȷ������������Ƿ����
        this.checkRePaypassBlur();
    },
    checkRePaypassFocus: function(){
        this.formHandler.switchInputStyle('normal','J_eRePaypass', 'J_eRePaypassTipImg','J_eRePaypassTipInfo');
        $('#J_eRePaypass').addClass('active');
        $('#J_eRePaypassTipInfo').html(this.formHandler.lang_zh['5607']);
//        $('#J_ePaypassUpperCase').hide();
    },
    checkRePaypassBlur: function(){
    	 this.rePasswordIsOk = false;
        $('#J_eRePaypass').removeClass('active');
        this.formHandler.switchInputStyle('normal','J_eRePaypass', 'J_eRePaypassTipImg','J_eRePaypassTipInfo');
        $("#J_eRePaypassUpperCase").hide();
        
        var passsword = $('#J_ePaypass').val();
        var rep_password = $('#J_eRePaypass').val();
        if (rep_password == '') {
            return false;
        }
        if (rep_password != passsword) {
            this.formHandler.switchInputStyle('error','J_eRePaypass', 'J_eRePaypassTipImg','J_eRePaypassTipInfo');          
            $('#J_eRePaypassTipInfo').html(this.formHandler.lang_zh['5608']);
            return false;
        }
        this.formHandler.switchInputStyle('ok','J_eRePaypass', 'J_eRePaypassTipImg','J_eRePaypassTipInfo');
        this.rePasswordIsOk = true;//ȷ�����������һ��
        return true;
    },
    checkIsOk: function(){
        var passsword = $('#J_ePaypass').val();
        var rep_password = $('#J_eRePaypass').val();
        if (passsword == '') {
            this.formHandler.switchInputStyle('error','J_ePaypass', 'J_ePaypassTipImg','J_ePaypassTipInfo'); 
            if(this.passwordMethod==='paypass'){
            	$('#J_ePaypassTipInfo').html(this.formHandler.lang_zh['5606']);//֧������
            }else{
            	$('#J_ePaypassTipInfo').html(this.formHandler.lang_zh['5610']);//��¼����
            }
            
        }
        if (rep_password == '') {
            this.formHandler.switchInputStyle('error','J_eRePaypass', 'J_eRePaypassTipImg','J_eRePaypassTipInfo'); 
            $('#J_eRePaypassTipInfo').html(this.formHandler.lang_zh['5609']);
            return false;
        }
        //ִ���޸�����
        if(this.passwordIsOk && this.rePasswordIsOk && typeof this.callback == 'function'){
            this.callback();
        }
    }
};

//��д�˺���彻��
var EidtUserName = Class.create();
EidtUserName.prototype = {
    initialize: function(callback){
    	this.callback = callback;
        this.formHandler = new FormHandler();        
        this.showVcodeOption = {
            "obj": this,
            "imgId": "J_imgVcode", 
            "inputId": "J_eUserNameCode",//�����id
            "tipImg": "J_eUserNameCodeTipImg",//�������ʾСͼ��
            "tipInfo":  "J_eUserNameCodeTipInfo"//�������ʾ��
        };
        this.formHandler.showVcode(this.showVcodeOption, true);
        this.initVerify();
    },
    initVerify: function(){
        //������꽹�����������ʱ��ʾ��Ϣ
        $('#J_eUserName').on('focus', {"obj": this, "callback": this.checkUserNameFocus},this.formHandler.exeEventHandler);
        //�������ʧȥ����ʱ�����ʾ��Ϣ
        $('#J_eUserName').on('blur', {"obj": this, "callback": this.checkUserNameBlur},this.formHandler.exeEventHandler);
        //������꽹�����������ʱ��ʾ��Ϣ
        $('#J_eUserNameCode').on('focus', {"obj": this, "callback": this.checkUserNameCodeFocus},this.formHandler.exeEventHandler);
        //�������ʧȥ����ʱ�����ʾ��Ϣ
        $('#J_eUserNameCode').on('blur', {"obj": this, "callback": this.checkUserNameCodeBlur},this.formHandler.exeEventHandler);
        
        //��ȡ������֤��
        $('#J_vcodeImgBtn').on('click', this.showVcodeOption, this.formHandler.eventShowVcode);
        $('#J_imgVcode').on('click', this.showVcodeOption, this.formHandler.eventShowVcode);
        //�ύ������֤ǰ����������֤����֤
        $('#J_eUserNameSubmit').on('click', {"obj": this, "callback": this.checkIsOk},this.formHandler.exeEventHandler);
    },
    checkUserNameFocus: function(){
        this.formHandler.switchInputStyle('normal','J_eUserName', 'J_eUserNameTipImg','J_eUserNameTipInfo');
        $('#J_eUserName').addClass('active');
        $('#J_eUserNameTipInfo').html(this.formHandler.lang_zh['5701']);
    },
    checkUserNameBlur: function(){
        $('#J_eUserName').removeClass('active');
        $('#J_eUserNameTipInfo').html('');
    },
    checkUserNameCodeFocus: function(){
        this.formHandler.switchInputStyle('normal','J_eUserNameCode', 'J_eUserNameCodeTipImg','J_eUserNameCodeTipInfo');
        $('#J_eUserNameCode').addClass('active');
        $('#J_eUserNameCodeTipInfo').html(this.formHandler.lang_zh['5704']);
    },
    checkUserNameCodeBlur: function(){
        $('#J_eUserNameCode').removeClass('active');
        $('#J_eUserNameCodeTipInfo').html('');
    },    
    checkIsOk: function(){
        var usernameCode = $.trim($('#J_eUserNameCode').val());
        var username = $.trim($('#J_eUserName').val());
        if(usernameCode == '' || username==''){
            if (usernameCode == '') {
                this.formHandler.switchInputStyle('error','J_eUserNameCode', 'J_eUserNameCodeTipImg','J_eUserNameCodeTipInfo');
                $('#J_eUserNameCodeTipInfo').html(this.formHandler.lang_zh['5704']);                
            }
            if(username==''){
                this.formHandler.switchInputStyle('error','J_eUserName', 'J_eUserNameTipImg','J_eUserNameTipInfo');
                $('#J_eUserNameTipInfo').html(this.formHandler.lang_zh['5701']);
            }
            return false;
        }
        var txtVcodeLen = usernameCode.length;
        if(this.formHandler.vcodeReg.test(usernameCode)){
            if(txtVcodeLen==4){
                if(!this.formHandler.checkVcodeOvertime(this.showVcodeOption)){
                    this.formHandler.switchInputStyle('error','J_eUserNameCode', 'J_eUserNameCodeTipImg','J_eUserNameCodeTipInfo');
                    $('#J_eUserNameCodeTipInfo').html(this.formHandler.lang_zh['5707']);
                    return false;
                }
                
                var obj = this;
                //��֤ͼ����֤���Ƿ���ȷ
                $.ajax({
                    type: 'POST',
                    url: 'p/check_img_vcode.php',
                    data: 'txtVcode=' + usernameCode,
                    async: false,
                    success: function (flg) {
                    	$('#J_errorCode').val(flg);
                    	if( flg==='0' ){
                    		obj.formHandler.switchInputStyle('ok','J_eUserNameCode', 'J_eUserNameCodeTipImg','J_eUserNameCodeTipInfo');
                    		obj.checkUserNameIsOk();
                            return true;
                    	} else if( flg==='1002' ){//��֤����֤ʧ��
                    		obj.formHandler.switchInputStyle('error','J_eUserNameCode', 'J_eUserNameCodeTipImg','J_eUserNameCodeTipInfo');
                            $('#J_eUserNameCodeTipInfo').html(obj.formHandler.lang_zh['5706']);
                            return false;
                    	} else if (flg === '1001') { //δ��¼
                    		window.location.href = $('#J_returnUrl').val();
                    		return false;
                        }else{ //�ӿڻ�ϵͳ�쳣
                        	obj.formHandler.switchInputStyle('error','J_eUserNameCode', 'J_eUserNameCodeTipImg','J_eUserNameCodeTipInfo');
                            $('#J_eUserNameCodeTipInfo').html(obj.formHandler.lang_zh['5001']);
                            return false;
                        }
                    }
                });               
            }else{
                this.formHandler.switchInputStyle('error','J_eUserNameCode', 'J_eUserNameCodeTipImg','J_eUserNameCodeTipInfo');
                $('#J_eUserNameCodeTipInfo').html(this.formHandler.lang_zh['5706']);
                return false;
            }
        }else {
            this.formHandler.switchInputStyle('error','J_eUserNameCode', 'J_eUserNameCodeTipImg','J_eUserNameCodeTipInfo');
            $('#J_eUserNameCodeTipInfo').html(this.formHandler.lang_zh['5706']);
            return false;
        }    
    },
    checkUserNameIsOk: function(){
    	var obj = this;
    	var usernameCode = $.trim($('#J_eUserNameCode').val());
        var username = $.trim($('#J_eUserName').val());     
        $.ajax({
            type: 'POST',
            url: 'p/check_username_exist.php',
            data: 'txtVcode=' + usernameCode + '&txtUser=' + username,
            async: false,
            dataType: 'json',
            success: function (flg) {
            	$('#J_errorCode').val(flg);
            	if (flg === true) {//�˺Ŵ���
            		obj.formHandler.switchInputStyle('ok','J_eUserName', 'J_eUserNameTipImg','J_eUserNameTipInfo');
            		if(typeof obj.callback == 'function'){
            			obj.callback();
            		}
	               	return true;
               } else if(flg === false){//�˺Ų����ڴ���
            	   obj.formHandler.switchInputStyle('error','J_eUserName', 'J_eUserNameTipImg','J_eUserNameTipInfo');
           			$('#J_eUserNameTipInfo').html(obj.formHandler.lang_zh['5703']);
           			return false;
               } else if(flg === '2001' || flg === '3001'){//�ӿ��쳣
                	obj.formHandler.switchInputStyle('error','J_eUserName', 'J_eUserNameTipImg','J_eUserNameTipInfo');
                    $('#J_eUserNameTipInfo').html(obj.formHandler.lang_zh['5001']);
                    return false;
                } else{//��������
                	obj.formHandler.switchInputStyle('error','J_eUserName', 'J_eUserNameTipImg','J_eUserNameTipInfo');
                    $('#J_eUserNameTipInfo').html(obj.formHandler.lang_zh['5001']);
                    return false;
                }                
            }
        });
    }
};
//�����֤ ��ȫ�󶨹�������
var FormHandler = Class.create();
FormHandler.prototype = {
    initialize: function(){
        this.emailNameReg = /^(([a-zA-Z0-9]+\w*((\.\w+)|(-\w+))*[\.-]?[a-zA-Z0-9]+)|([a-zA-Z0-9]))$/; //ƥ����������
        this.emailReg = /^(([a-zA-Z0-9]+\w*((\.\w+)|(-\w+))*[\.-]?[a-zA-Z0-9]+)|([a-zA-Z0-9]))\@[a-zA-Z0-9]+((\.|-)[a-zA-Z0-9]+)*\.[a-zA-Z0-9]+$/; //ƥ������
        this.mobileReg = /^1[3,4,5,7,8][0-9]{9}$/;//ƥ��绰����
        this.vcodeReg = /^[a-zA-Z0-9]*$/;//ƥ��ͼ����֤��
        this.passwordReg = /^\S{1,20}$/;//ƥ������ ƥ�����зǿհ�
        
        this.miao = 0;//���ε���ʱʣ��ʱ��        
        this.timeoutRun = 0; //����ʱ������
        this.getCodeBtn = '';//��ȡ��֤�밴ťid
        this.unGetCodeBtn = '';//��ʾ����ʱ��ťid
        this.tipId = '';//��ʾ��ȡ��֤�������Ϣid
        
        this.vcodeGenerateTiem = 0;//ͼ����֤������ʱ��
        this.vcodeOvertimeInterval = 10 * 60 * 1000;//ͼ����֤����Ч��Ϊ10����
        this.lang_zh = {
            '5000': '��֤���ѷ��ͣ���ע�����',
            '5001': '���緱æ�����Ժ�����',
            '5002': '���ڻ�ȡ...',
            '5003': '��ȡ��֤��',
            '5004': '�����֤ʧ��',
            '5005': '���»�ȡ��֤��',
            //�ֻ���֤  
            '5101': '�����������֤��',
            '5102': '��֤�������������ȷ����֤��',
            '5103': '��֤���ѷ��ͣ���ע����գ�',
            '5104': '120���ڽ��ܻ�ȡһ�ζ�����֤�룬���Ժ�����',
            '5105': '��֤���ȡƵ������24Сʱ�����»�ȡ',//
            '5106': '��ȡ��֤��',
            '5107': '���»�ȡ��֤��',
            '5108': '����û���յ���֤�룿����24Сʱ�����ԣ��������֤��ʽ',//�����֤��������ͬһ������л�ȡ��֤�����5��
            '5109': 'ͬһIP��֤���ȡƵ�������Ժ�����',
            '5110': '����ֻ��Ų�һ��',
            '5111': '��������ֻ���',
            //������֤
            '5201': '������������֤��',
            '5202': '��֤�������������ȷ����֤��',
            '5203': '��֤���ѷ��ͣ���ע�����',
            '5204': '120���ڽ��ܻ�ȡһ��������֤�룬���Ժ�����',
            '5205': '��֤���ȡƵ������24Сʱ�����»�ȡ',//�����֤���ֻ�����ͬһ������л�ȡ��֤�����5��
            '5206': '��ȡ��֤��',
            '5207': '���»�ȡ��֤��',
            '5208' : '����û���յ���֤�룿����24Сʱ�����ԣ��������֤��ʽ',            
            //֧��������֤ 
            '5301': '������֧������',
            '5302': '֧������������������룬�㻹��{#getNumber#}�λ���',
            '5303': '֧�����������������ﵽ����5�Σ�����24Сʱ������',//֧��������֤��ͬһ������д����������5��
            //�����ֻ���            
            '5401': '�������ֻ���',
            '5402': '��������ȷ��ʽ���ֻ���',
            '5403': '���ֻ����ѱ���֤�����»�һ��', 
            //����������
            '5501': '����������',
            '5502': '��������ȷ��ʽ������',
            '5503': '�������ѱ���֤�����»�һ��',      
            //����֧������  ��¼����
            '5601': '����Ϊ6-20���ַ�������Ӣ�ġ����ּ��������',
            '5602': '���볤��6-20���ַ�������������',      
            '5603': '�������¼���롢�ǳơ������û������ֻ�����ͬ������������',      
            '5604': '���벻�ܰ������ո񡱣�����������',            
            '5605': '����Ϊ6-20λ�ַ�,ֻ����Ӣ�ġ����ּ��������',
            '5606': '������֧������',
            '5607': '���ٴ���������',
            '5608': '������������벻һ�£�����������',
            '5609': 'ȷ������Ϊ��',
            '5610': '����������',
            '5611': '��¼���벻������˺��ڵ�����������ͬ������������',
            //�һ�����ʱ����֤��д���û���
            '5701': '���������ڵ�¼ʱʹ�õ�����/�ֻ���/�ǳ�',
            '5702': '���������ڵ�¼ʱʹ�õ�����/�ֻ���/�ǳ�',
            '5703': '��������˻��������ڣ���˶Ժ���������',            
            '5704': '����дͼƬ�е��ַ��������ִ�Сд',
            '5705': '������ͼ����֤��',
            '5706': 'ͼ����֤�������������������',
            '5707': 'ͼ����֤����ʧЧ������������',
            '60000': ''
        };
    },
    //����Ԫ��ָ��������ʽ
    switchInputStyle: function(showType, inputId, tipImgId, tipInfoId){
        if(showType == 'normal') {
            $('#' + inputId).removeClass('w_red');
            $('#' + tipImgId).hide();
            $('#' + tipInfoId).removeClass('wrong').html('').show();
        }else if(showType == 'ok') {
            $('#' + inputId).removeClass('w_red');
            $('#' + tipImgId).removeClass('wrong').css({'display':'inline-block'});
            $('#' + tipInfoId).removeClass('wrong').html('').show();
        } else if(showType == 'error') {
            $('#' + inputId).addClass('w_red');
            $('#' + tipImgId).addClass('wrong').css({'display':'inline-block'});
            $('#' + tipInfoId).addClass('wrong').show();
        }
    },
    //ִ���¼�����
    exeEventHandler: function(e){
        //var e = window.event || e;
        e.data.callback.apply(e.data.obj, arguments);
    },
    //���»�ȡ��֤��ǰ�ĵ���ʱ
    changejishi: function(){
        this.miao--;
        var fen, smiao;
        fen = parseInt( this.miao/60 );
        smiao = this.miao - ( fen * 60 );
        var fenstr = '';
        if(fen > 0){
            fenstr = fen + '��';
        }
        if(this.miao > 0){
            $('#' + this.unGetCodeBtn).show().html( fenstr + smiao + '������»�ȡ' );
            $('#' + this.getCodeBtn).hide();
            clearTimeout(this.timeoutRun);
            var obj = this;
            this.timeoutRun = setTimeout(function(){
                obj.changejishi();
            }, 1000);
            
        }else{
            $('#' + this.getCodeBtn).show();
            $('#' + this.unGetCodeBtn).hide();
            $('#' + this.tipId).html('');
        }
    },
    checkCapslockOpen: function(e){
       // var e.data.callback.apply(e.data.obj, arguments);
       // var  e= window.event || e;
        var upperCapsId = e.data.upperCapsId;
        var otherTipIds = e.data.otherTipIds;
        var n = e.keyCode || e.which;
        var m = e.shiftKey||(n==16)||false;
        if (((n >= 65 && n <= 90) && !m) || ((n >= 97 && n <= 122 )&& m)) {
            var len = 0;
            if(otherTipIds && otherTipIds!='' && (len =otherTipIds.length)>0){
                for(var i=0;i<len;i++){
                    $('#' + otherTipIds[i]).hide();
                }
            }            
            $("#" + upperCapsId).show();
        } else if(n >= 97 && n <= 122 && !m){
            $("#" + upperCapsId).hide();
        } else if(n==27){
            $("#" + upperCapsId).hide();
        } else{
            $("#" + upperCapsId).hide();
        }
    },
    eventCheckPassStrong: function(e){
        var that = e.data.obj;
        var option ={
                    "obj": e.data.obj, //��ǰ��������
                    "inputId": e.data.inputId,//�����id
                    "tipImg": e.data.tipImg,//�������ʾСͼ��
                    "tipInfo":  e.data.tipInfo,//��ʾ�ı���
                    "itemWrapId": e.data.itemWrapId,//��ʾ����ǿ�ȸ�Ԫ��id
                    "itemIdPrefix": e.data.itemIdPrefix,//3������ǿ�ȵ�idǰ׺
                    "itemClass": e.data.itemClass,//����ǿ�� ����class
                    "upperCapsId": e.data.upperCapsId, //��д��ʾ����id
                    "otherTipIds": e.data.otherTipIds//��ʾ����ǿ��ʱ����Ҫ���ص�Ԫ��
                   };
       that.formHandler.checkPassStrong(option);         
    },
    checkPassStrong: function(option){//����ǿ����ʾ
        /***
         * setting: {
                    "obj": this, //��ǰ��������
                    "inputId":"J_ePaypass",//�����id
                    "tipImg":"J_ePaypassTipImg",//�������ʾСͼ��
                    "tipInfo": "J_ePaypassTipInfo",//��ʾ�ı���
                    "itemWrapId":"J_ePaypassStrongWrap",//��ʾ����ǿ�ȸ�Ԫ��id
                    "itemIdPrefix":"J_ePaypassStrong",//3������ǿ�ȵ�idǰ׺
                    "itemClass": "j_pwdStrong",//����ǿ�� ����class
                    "upperCapsId": "J_ePaypassUpperCase", //��д��ʾ����id
                    "otherTipIds":["J_ePaypassTipInfo", "J_ePaypassStrongWrap"]//��ʾ����ǿ��ʱ����Ҫ���ص�Ԫ��
                   };
         * */
        var that = option.obj;
        var inputId = option.inputId;
        var tipImg = option.tipImg;
        var tipInfo = option.tipInfo;
        
        var upperCapsId = option.upperCapsId;
        var otherTipIds = option.otherTipIds;        
        var passStrongWrapId = option.itemWrapId;
        var passStrongId = option.itemIdPrefix;
        var passStrongClass = option.itemClass;
        if($('#' + upperCapsId).is(':hidden')){
            that.formHandler.switchInputStyle('normal',inputId, tipImg,tipInfo);
            var len = 0;
            if(otherTipIds && otherTipIds!='' && (len =otherTipIds.length)>0){
                for(var i=0;i<len;i++){
                    $('#' + otherTipIds[i]).hide();
                }
            }            
            var password = $('#' + inputId).val();
            var passLen = password.length;
            if (passLen == 0) {
                $('#' + tipInfo).html(that.formHandler.lang_zh['5601']).show();                
                return false;
            }
            
            if (passLen < 6) {
                $('#' + passStrongWrapId).show();
                $('.' + passStrongClass).hide();
                $('#' + passStrongId + '1').show(); 
                return false;
            }
            
            if (passLen > 20){
                that.formHandler.switchInputStyle('error',inputId, tipImg,tipInfo);
                $('#'+ tipInfo).html(that.formHandler.lang_zh['5602']).show();
                return false;
            }
            var chenum = checkStrong(password);
            if (chenum == 0) {
                return false;
            } else if (chenum == 1) {
                $('.' + passStrongClass).hide();
                $('#' + passStrongId + '1').show(); 
            } else if (chenum == 2) {
                $('.' + passStrongClass).hide();
                $('#' + passStrongId + '2').show(); ;
            } else if (chenum >= 3) {                   
                $('.' + passStrongClass).hide();
                $('#' + passStrongId + '3').show(); 
            }
            $('#' + passStrongWrapId).show();
            that.formHandler.switchInputStyle('ok',inputId, tipImg,tipInfo);
            return true;
        }
    }, 
    eventShowVcode: function(e){
        var that = e.data.obj;
        var option ={
                    "obj": e.data.obj, //��ǰ��������
                    "imgId": e.data.imgId, 
                    "inputId": e.data.inputId,//�����id
                    "tipImg": e.data.tipImg,//�������ʾСͼ��
                    "tipInfo":  e.data.tipInfo
                   };
       that.formHandler.showVcode(option);         
    },   
    showVcode: function(option, unchangeImg) {//��ȡͼ����֤��
    /**
        var data = e.data;
        var option ={
            "imgId": data.imgId, 
            "inputId": data.inputId,//�����id
            "tipImg": data.tipImg,//�������ʾСͼ��
            "tipInfo":  data.tipInfo
        };
        * */
        this.vcodeGenerateTiem = new Date().getTime();
        if(unchangeImg!==true){
        	$('#' + option.imgId).attr('src', 'http://vcode.dangdang.com/show_vcode.php?t=' + new Date().getTime());
        }        
        $('#' + option.inputId).val('');
        this.switchInputStyle('normal',option.inputId, option.tipImg, option.tipInfo);
    },
    checkVcodeOvertime: function(option){
        var nowTime = new Date().getTime();
        if( (nowTime - this.vcodeGenerateTiem)> this.vcodeOvertimeInterval ){
            this.showVcode(option);
            return false;
        }else{
            return true;
        }
    }
};
function checkStrong (sPW){
    if (sPW.length < 1){
        return 0;
    }
    var Modes = 0;
    for (var i = 0; i < sPW.length; i++) {
        Modes |= Evaluate(sPW.charCodeAt(i));
    }
    var num = bitTotal(Modes);
    return num;
}
//����ǿ����֤
function Evaluate(character){
    if (character >= 48 && character <= 57){
        return 1;
    } else if (character >= 65 && character <= 90) {
        return 2;
    } else if (character >= 97 && character <= 122) {
        return 4;
    } else {
        return 8;
    }
}
//����ǿ����֤
function bitTotal(num){
    var modes = 0;
    for (var i = 0; i < 4; i++) {
        if (num & 1) modes++;
        num >>>= 1;
    }
    return modes;
}
//����̨��json�ַ���תΪ�����֤�б������Ϣ
function strToVerifyList(str){
	var jsonStr = JSON.parse(str);
	var obj = {
			phoneValue: '',
			emailValue: '',
			verifyModeArr: []
	};
	//��ȡ�����֤�� ���ͺ�ֵ
	for(var item in jsonStr){
		obj.verifyModeArr.push(item);
		if(item === 'email'){
			obj.emailValue = jsonStr[item];
		}
		
		if(item === 'phone'){
			obj.phoneValue = jsonStr[item];
		}		
	}
	return obj;
}