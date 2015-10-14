'use stric'

app.config(function($httpProvider, $translateProvider, ScrollBarsProvider) {
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
        'CREATE_ACCOUNT': 'Create Account',
        'HELLO': 'Hello',
        'ADD_VIDEO_TITLE': 'Add Video',
        'SEARCH_INPUT_PLACEHOLDER': 'Search on Youtube and Vimeo',
        'DRAG_PLACE_TITLE':'Drag here to add to Playlist'
    });
    $translateProvider.translations('pt-br', {
        'CREATE_ACCOUNT': 'Criar Conta',
        'HELLO': 'Olá',
        'ADD_VIDEO_TITLE': 'Adicionar Vídeo',
        'SEARCH_INPUT_PLACEHOLDER': 'Pesquisar vídeo no Youtube e Vimeo',
        'DRAG_PLACE_TITLE':'Arraste aqui para adicionar a Playlist'
    });  
    $translateProvider.preferredLanguage('pt-br');
    //$translateProvider.useLocalStorage();

    //console.log('$translateProvider', $translateProvider);

	$httpProvider.interceptors.push('authInterceptor');
});