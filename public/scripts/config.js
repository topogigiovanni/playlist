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
	$translateProvider.translations('en', {
		'ERROR_LOGIN_INVALID_EMAIL_PASS': 'Please enter your email and password.',
		'ERROR_LOGIN_INVALID_EMAIL': 'Please enter a valid email.',        
        'CREATE_ACCOUNT': 'Create Account',
        'FORGOT_MY_PASS': 'I forgot my password',
        'HELLO': 'Hello',
        'ADD_VIDEO_TITLE': 'Add Video',
        'SEARCH_INPUT_PLACEHOLDER': 'Search on Youtube and Vimeo',
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
        'LOGIN_BUTTON': 'Go'
    });
    $translateProvider.translations('pt-br', {
    	'ERROR_LOGIN_INVALID_EMAIL_PASS': 'Insira um email e uma senha válidos',
        'ERROR_LOGIN_INVALID_EMAIL': 'Insira um email válido.',
        'CREATE_ACCOUNT': 'Criar Conta',
        'FORGOT_MY_PASS': 'Esqueci minha senha',
        'HELLO': 'Olá',
        'ADD_VIDEO_TITLE': 'Adicionar Vídeo',
        'SEARCH_INPUT_PLACEHOLDER': 'Pesquisar vídeo no Youtube e Vimeo',
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
        'LOGIN_BUTTON': 'Ir'
    });  
    $translateProvider.preferredLanguage('pt-br');
    
    //$translateProvider.useLocalStorage();

    //console.log('$translateProvider', $translateProvider);

	$httpProvider.interceptors.push('authInterceptor');
});