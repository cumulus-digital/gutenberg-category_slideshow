<?php
/**
 * Blocks Initializer
 *
 * Enqueue CSS/JS of all the blocks.
 *
 * @since   1.0.0
 * @package CGB
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Enqueue Gutenberg block assets for both frontend + backend.
 *
 * Assets enqueued:
 * 1. blocks.style.build.css - Frontend + Backend.
 * 2. blocks.build.js - Backend.
 * 3. blocks.editor.build.css - Backend.
 *
 * @uses {wp-blocks} for block type registration & related functions.
 * @uses {wp-element} for WP Element abstraction — structure of blocks.
 * @uses {wp-i18n} to internationalize the block's text.
 * @uses {wp-editor} for WP editor styles.
 * @since 1.0.0
 */
function gutenberg_category_slideshow_cgb_block_assets() { // phpcs:ignore
	// Register block styles for both frontend + backend.
	wp_register_style(
		'gutenberg_category_slideshow/styles', // Handle.
		plugins_url( 'dist/blocks.style.build.css', dirname( __FILE__ ) ), // Block style CSS.
		array( 'wp-editor' ), // Dependency to include the CSS after it.
		null // filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.style.build.css' ) // Version: File modification time.
	);

	// Register block editor script for backend.
	wp_register_script(
		'gutenberg_category_slideshow/scripts', // Handle.
		plugins_url( '/dist/blocks.build.js', dirname( __FILE__ ) ), // Block.build.js: We register the block here. Built with Webpack.
		array( 'wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor' ), // Dependencies, defined above.
		null, // filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.build.js' ), // Version: filemtime — Gets file modification time.
		true // Enqueue the script in the footer.
	);

	// Register block editor styles for backend.
	wp_register_style(
		'gutenberg_category_slideshow-cgb/styles/editor', // Handle.
		plugins_url( 'dist/blocks.editor.build.css', dirname( __FILE__ ) ), // Block editor CSS.
		array( 'wp-edit-blocks' ), // Dependency to include the CSS after it.
		null // filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.editor.build.css' ) // Version: File modification time.
	);

	// WP Localized globals. Use dynamic PHP stuff in JavaScript via `cgbGlobal` object.
	wp_localize_script(
		'gutenberg_category_slideshow/scripts',
		'gutenberg_category_slideshow', // Array containing dynamic data for a JS Global.
		[
			'pluginDirPath' => plugin_dir_path( __DIR__ ),
			'pluginDirUrl'  => plugin_dir_url( __DIR__ ),
			'ajaxUrl' => admin_url( 'admin-ajax.php' )
		]
	);

	/**
	 * Register Gutenberg block on server-side.
	 *
	 * Register the block on server-side to ensure that the block
	 * scripts and styles for both frontend and backend are
	 * enqueued when the editor loads.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/blocks/writing-your-first-block-type#enqueuing-block-scripts
	 * @since 1.16.0
	 */
	register_block_type(
		'cumulus-gutenberg/category-slideshow', array(
			// Enqueue blocks.style.build.css on both frontend & backend.
			'style'         => 'gutenberg_category_slideshow/styles',
			// Enqueue blocks.build.js in the editor only.
			'editor_script' => 'gutenberg_category_slideshow/scripts',
			// Enqueue blocks.editor.build.css in the editor only.
			'editor_style'  => 'gutenberg_category_slideshow/styles/editor',
		)
	);

}

// Hook: Block assets.
add_action( 'enqueue_block_editor_assets', 'gutenberg_category_slideshow_cgb_block_assets' );

// Frontend
function gutenberg_category_slideshow_frontend_assets() {
	if (has_block('cumulus-gutenberg/category-slideshow')) {
		wp_enqueue_script(
			'cumulus-gutenberg/category-slideshow/scripts/frontend',
			plugins_url( 'frontend.js', dirname(__FILE__) ),
			array( 'jquery' ),
			null,
			true
		);
		wp_localize_script(
			'cumulus-gutenberg/category-slideshow/scripts/frontend',
			'gutenberg_category_slideshow', // Array containing dynamic data for a JS Global.
			[
				'pluginDirPath' => plugin_dir_path( __DIR__ ),
				'pluginDirUrl'  => plugin_dir_url( __DIR__ ),
				'ajaxUrl' => admin_url( 'admin-ajax.php' )
			]
		);
		wp_enqueue_style(
			'cumulus-gutenberg/category-slideshow/styles/frontend',
			plugins_url( 'dist/blocks.style.build.css', dirname( __FILE__ ) )
		);
	}
}
add_action('enqueue_block_assets', 'gutenberg_category_slideshow_frontend_assets');

// Add ajax for retrieving media by category
function gutenberg_category_slideshow_ajax_calls() {
	$category = json_decode($_POST['category'], true);
	if ( ! filter_var($category, FILTER_VALIDATE_INT)) {
		header('HTTP/1.0 400 Bad error');
		echo '{ error: "Bad category." }';
	} else {

		$args = array(
		    'category' => $category,
		    'post_type' => 'attachment'
		);
		$media = \get_posts($args);
		if ( ! empty($_GET['callback'])) {
			echo $_GET['callback'] . '(' . json_encode($media) . ');';
		} else {
			echo json_encode($media);
		}

	}
}
add_action('wp_ajax_get_media_by_category', 'gutenberg_category_slideshow_ajax_calls');
add_action('wp_ajax_nopriv_get_media_by_category', 'gutenberg_category_slideshow_ajax_calls');