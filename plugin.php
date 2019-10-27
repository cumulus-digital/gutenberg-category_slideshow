<?php
/**
 * Plugin Name: Image Category Slideshow
 * Plugin URI: https://github.com/cumulus-digital/gutenberg-category_slideshow
 * Description: Display a slideshow of media in a specified category
 * Author: vena
 * Author URI: https://github.com/vena
 * Version: 1.0.0
 * License: GPL2+
 * License URI: https://www.gnu.org/licenses/gpl-2.0.txt
 * GitHub Plugin URI: cumulus-digital/gutenberg-category_slideshow
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Block Initializer.
 */
require_once plugin_dir_path( __FILE__ ) . 'src/init.php';
