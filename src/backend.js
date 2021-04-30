import './jquery.crsgCategorySlideshow.js';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { PanelBody, PanelRow, SelectControl, RangeControl } = wp.components;
const { InspectorControls } = wp.blockEditor;
const { Component } = wp.element;

const objectsEqual = ( o1, o2 ) =>
	typeof o1 === 'object' && Object.keys( o1 ).length > 0
		? Object.keys( o1 ).length === Object.keys( o2 ).length &&
		  Object.keys( o1 ).every( ( p ) => objectsEqual( o1[ p ], o2[ p ] ) )
		: o1 === o2;

registerBlockType( 'cumulus-gutenberg/category-slideshow', {
	title: __( 'Category Slideshow' ),

	description: __(
		'Gutenberg block which displays a slideshow of media in a specified category.'
	),

	keywords: [
		__( 'slideshow' ),
		__( 'slider' ),
		__( 'image' ),
		__( 'category' ),
	],

	supports: {
		anchor: true,
		html: false,
	},

	category: 'common',

	icon: {
		src: 'images-alt2',
		foreground: '#3399cc',
	},

	attributes: {
		category: {
			attribute: 'string',
			default: null,
		},
		timeout: {
			attributes: 'integer',
			default: 2,
		},
	},

	edit: class extends Component {
		constructor() {
			super( ...arguments );
			this.onChangeContent = this.onChangeContent.bind( this );
			this.componentDidUpdate = this.componentDidUpdate.bind( this );
			this.componentDidMount = this.componentDidMount.bind( this );
			this.state = {};
			this.initSlider = () => {
				jQuery(
					'#block-' + this.props.clientId + ' > div'
				).crsgCategorySlideshow( window.ajaxurl );
			};
		}
		componentDidUpdate( prevProps ) {
			if (
				! objectsEqual( this.props.attributes, prevProps.attributes )
			) {
				this.initSlider();
			}
		}
		componentDidMount() {
			if ( this.props.attributes.category ) {
				this.initSlider();
			}
		}
		onChangeContent( data ) {
			this.props.setAttributes( { content: data } );
		}

		render() {
			const props = this.props;
			return (
				<div
					className={ props.className }
					data-category={ props.attributes.category }
					data-timeout={ props.attributes.timeout }
				>
					<div className="crsg-category_slideshow-loading"></div>
					<InspectorControls>
						<PanelBody title="Slideshow Options">
							<PanelRow>
								<SelectControl
									label="Media Category:"
									value={ props.attributes.category }
									options={ ( () => {
										const cats = wp.data
											.select( 'core' )
											.getEntityRecords(
												'taxonomy',
												'category'
											);
										if ( cats && cats.length ) {
											return cats.map( ( cat ) => {
												return {
													label: cat.name,
													value: cat.id,
												};
											} );
										}
										return [
											{ label: 'No categories defined!' },
										];
									} )() }
									onChange={ ( cat ) => {
										props.setAttributes( {
											category: cat,
										} );
									} }
								/>
							</PanelRow>
						</PanelBody>
						<PanelBody title="Timer">
							<h3>Seconds between slides</h3>
							<PanelRow>
								<RangeControl
									value={ props.attributes.timeout }
									onChange={ ( value ) => {
										props.setAttributes( {
											timeout: value,
										} );
									} }
									min={ 0 }
									max={ 20 }
								/>
							</PanelRow>
						</PanelBody>
					</InspectorControls>
				</div>
			);
		}
	},

	save: ( props ) => {
		return (
			<div
				className={ props.className }
				data-category={ props.attributes.category }
				data-timeout={ props.attributes.timeout }
			></div>
		);
	},
} );
