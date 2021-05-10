<?php
namespace CRSG\Wordpress\Gutenberg\CategorySlideshow;
/**
 * Plugin Name: Image Category Slideshow
 * Plugin URI: https://github.com/cumulus-digital/gutenberg-category_slideshow/
 * Description: Gutenberg block which displays a slideshow of media in a specified category.
 * Version: 2.0.2
 * Author: vena
 * License: UNLICENSED
 * GitHub Plugin URI: cumulus-digital/gutenberg-category_slideshow
 *
 * @category Gutenberg
 * @author vena
 * @version 2.0.2
 */
// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) exit;

// Editor Assets
function editor_assets(){
	$url = \untrailingslashit( \plugin_dir_url( __FILE__ ) );

	$assets = include( \plugin_dir_path( __FILE__ ) . 'build/backend.asset.php');
	\wp_enqueue_script(
		'category_slideshow-backend-js', // Handle.
		$url . '/build/backend.js',
		$assets['dependencies'],
		$assets['version'],
		true
	);
}
\add_action( 'enqueue_block_editor_assets', __NAMESPACE__ . '\\editor_assets' );

// Frontend Assets
function frontend_assets(){
	if (has_block('cumulus-gutenberg/category-slideshow')) {

		$url = \untrailingslashit( \plugin_dir_url( __FILE__ ) );
		
		\wp_enqueue_style(
			'category_slideshow-frontend-css', // Handle.
			$url . '/build/frontend.css'
		);

		if ( ! \is_admin()) {

			$assets = include( \plugin_dir_path( __FILE__ ) . 'build/frontend.asset.php');
			\wp_enqueue_script(
				'category_slideshow-frontend-js', // Handle.
				$url . '/build/frontend.js',
				$assets['dependencies'],
				$assets['version'],
				true
			);

			\wp_localize_script(
				'category_slideshow-frontend-js',
				'crsg_category_slideshow',
				[
					'pluginDirPath' => plugin_dir_path( __DIR__ ),
					'pluginDirUrl'  => plugin_dir_url( __DIR__ ),
					'ajaxUrl' => admin_url( 'admin-ajax.php' )
				]
			);
		
		}

	}
}
\add_action( 'enqueue_block_assets', __NAMESPACE__ . '\\frontend_assets' );

function ajax_handler() {
	$category = json_decode($_POST['category'], true);
	if ( ! filter_var($category, FILTER_VALIDATE_INT)) {
		header('HTTP/1.0 400 Bad error');
		echo '{ error: "Bad category." }';
	} else {

		$args = array(
			'category' => $category,
			'post_type' => 'attachment',
			'post_mime_type' => 'image',
			'post_status' => array('inherit','publish'),
			'numberposts' => -1,
			'posts_per_page' => -1
		);
		$media = \get_posts($args);
		if ( ! empty($_GET['callback'])) {
			echo $_GET['callback'] . '(' . json_encode($media) . ');';
		} else {
			echo json_encode($media);
		}

	}
}
add_action('wp_ajax_get_media_by_category', __NAMESPACE__ . '\\ajax_handler');
add_action('wp_ajax_nopriv_get_media_by_category', __NAMESPACE__ . '\\ajax_handler');
