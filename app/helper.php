<?php
	//http://blog.jonaszamora.es/en/php-snippet-get-vimeo-image-thumbnails/
	function getVieoThumb($id, $size){
		$vimeo = unserialize(file_get_contents("http://vimeo.com/api/v2/video/$id.php"));
		var_dump($vimeo);
	}

	$task = $_GET['task'];
	if(!is_null($task)){
		switch ($task) {
			case 'vimeothumb':
				$id = $_GET['id'];
				$size = $_GET['size'];
				if(!is_null($id) && !is_null($size)){
					getVieoThumb($id, $size);
				}
				break;
			
			default:
				# code...
				break;
		}
	}
?>