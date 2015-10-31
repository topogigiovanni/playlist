'use stric'

app.config(function($httpProvider, $translateProvider,  ScrollBarsProvider) {
	// Scrollbar defaults
	ScrollBarsProvider.defaults = {
		autoHideScrollbar: false,
		setHeight: 352, //100
		scrollInertia: 0,
		axis: 'y',
		advanced: {
			updateOnContentResize: true
				//,releaseDraggableSelectors: "#playlist li img" 
		},
		scrollButtons: {
			scrollAmount: 'auto', // scroll amount when button pressed
			enable: false // enable scrolling buttons by default
		}
	};

	// Translations
	// EN
	$translateProvider.translations('en', {
		'ERROR_LOGIN_INVALID_EMAIL_PASS': 'Please enter your email and password.',
		'ERROR_LOGIN_INVALID_EMAIL': 'Please enter a valid email.',        
        'CREATE_ACCOUNT': 'Create Account',
        'FORGOT_MY_PASS': 'I forgot my password',
        'HELLO': 'Hello',
        'ADD_VIDEO_TITLE': 'Add Video',
        'SEARCH_INPUT_PLACEHOLDER': 'Search or paste URL',
        'DRAG_PLACE_TITLE':'Drag here to add to Playlist',
        'MYPLAYLIST_BUTTON': 'My Playlists',
        'CREATE_NEW_PLAYLIST': 'Create new Playlist',
        'PLAYLIST_OPT_RENAME': 'Rename',
        'PLAYLIST_OPT_DELETE': 'Deletar',
        'SAVE_PLAYLIST_BUTTON': 'Save Playlist',
        'CLEAN_PLAYLIST_BUTTON': 'Clean Playlist',
        'PLAYLIST_TITLE': 'Video List',
        'TOTAL_TIME': 'Total time',
        'SEARCH_ADD_BUTTON': 'Add to list',
        'ADD_INPUT_PLACEHOLDER': 'Url',
        'LOGIN_WITH_FB': 'Login with Facebook',
        'LOGIN_WITH_G': 'Login with Google+',
        'LOGIN_BUTTON': 'Go',
        'REGISTER_WITH_FB': 'Register with Facebook',
        'REGISTER_WITH_G': 'Register with Google+',
        'REGISTER_BUTTON': 'Register',
        'CREATE_ACCOUNT_MODAL_TITLE': 'Create Account',
        'USER_LOGIN_EMAIL_NOT_REGISTERED': 'This email is not registered.',
    	'USER_LOGIN_PASS_WRONG': 'This password is not correct.',
    	'USER_REGISTER_MIN_CHAR_PASS': 'Your password must be at least 3 characters.',
        'USER_REGISTER_NAME': 'Name is required.',
        'USER_REGISTER_EMAIL_INVALID': 'Please enter a valid email.',
        'USER_REGISTER_EMAIL': 'Enter your email.',
        'SITE_DESCRIPTION': 'ECreate your playlists fast, free and easy'
    });
    // PT_BR
    $translateProvider.translations('pt-br', {
    	'ERROR_LOGIN_INVALID_EMAIL_PASS': 'Insira um email e uma senha válidos',
        'ERROR_LOGIN_INVALID_EMAIL': 'Insira um email válido.',
        'CREATE_ACCOUNT': 'Criar Conta',
        'FORGOT_MY_PASS': 'Esqueci minha senha',
        'HELLO': 'Olá',
        'ADD_VIDEO_TITLE': 'Adicionar Vídeo',
        'SEARCH_INPUT_PLACEHOLDER': 'Pesquise ou cole a URL',
        'DRAG_PLACE_TITLE':'Arraste aqui para adicionar a Playlist',
        'MYPLAYLIST_BUTTON': 'Minhas Playlists',
        'CREATE_NEW_PLAYLIST': 'Criar nova Playlist',
        'PLAYLIST_OPT_RENAME': 'Renomear',
        'PLAYLIST_OPT_DELETE': 'Deletar',
        'SAVE_PLAYLIST_BUTTON': 'Salvar Playlist',
        'CLEAN_PLAYLIST_BUTTON': 'Limpar Playlist',
        'PLAYLIST_TITLE': 'Lista de reprodução',
        'TOTAL_TIME': 'Tempo total',
        'SEARCH_ADD_BUTTON': 'Adicionar a lista',
        'ADD_INPUT_PLACEHOLDER': 'Cole aqui a URL do vídeo',
        'LOGIN_WITH_FB': 'Logar pelo Facebook',
        'LOGIN_WITH_G': 'Logar pelo Google+',
        'LOGIN_BUTTON': 'Ir',
        'REGISTER_WITH_FB': 'Cadastre-se pelo Facebook',
        'REGISTER_WITH_G': 'Cadastre-se pelo Google+',
        'REGISTER_BUTTON': 'Cadastrar',
        'CREATE_ACCOUNT_MODAL_TITLE': 'Criar conta',
        'USER_LOGIN_EMAIL_NOT_REGISTERED': 'Email não cadastrado.',
        'USER_LOGIN_PASS_WRONG': 'Senha incorreta.',
        'USER_REGISTER_MIN_CHAR_PASS': 'Sua senha deve ter no mínimo 3 caracteres.',
        'USER_REGISTER_NAME': 'Nome é obrigatório.',
        'USER_REGISTER_EMAIL_INVALID': 'Digite um email válido.',
        'USER_REGISTER_EMAIL': 'Digite seu email.',
        'SITE_DESCRIPTION': 'Experimente criar suas playlists de forma rápida, grátis e descomplicada'

    });  
    //$translateProvider.preferredLanguage('pt-br');
    $translateProvider.preferredLanguage('en');

    //$translateProvider.useLocalStorage();

    //console.log('$translateProvider', $translateProvider);

	$httpProvider.interceptors.push('authInterceptor');
});