import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IDataObject,
	JsonObject,
} from 'n8n-workflow';

import { NodeApiError, NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';

const BASE_URL = 'https://headless-sass-bzzrfsh6ra-el.a.run.app';

export class HeadlessSaas implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Infographic Image Generator',
		name: 'headlessSaas',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Generate infographics, comics, cover images, social carousels and slide decks using PixlrAPI',
		defaults: { name: 'Infographic Image Generator' },
		usableAsTool: true,

		icon: {
			light: 'file:logo.svg',
			dark: 'file:logo.dark.svg',
		},

		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],

		credentials: [
			{
				name: 'headlessSaasApi',
				required: true,
			},
		],

		properties: [
			// ── Operation ───────────────────────────────────────────────────────
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				options: [
					{
						name: 'Comic',
						value: 'comic',
						description: 'Convert story or educational content into a comic panel (baoyu-comic)',
						action: 'Generate comic',
					},
					{
						name: 'Cover Image',
						value: 'coverImage',
						description: 'Generate a hero/cover image for a blog or landing page (baoyu-cover-image)',
						action: 'Generate cover image',
					},
					{
						name: 'Infographic',
						value: 'infographic',
						description: 'Convert text into a structured visual infographic (baoyu-infographic)',
						action: 'Generate infographic',
					},
					{
						name: 'Slide Deck',
						value: 'slideDeck',
						description: 'Generate a full business presentation deck (baoyu-slide-deck)',
						action: 'Generate slide deck',
					},
					{
						name: 'XHS / Social Carousel',
						value: 'xhsImages',
						description: 'Generate vertical carousel pages for social media (baoyu-xhs-images)',
						action: 'Generate XHS carousel',
					},
				],
				default: 'infographic',
			},

			// ════════════════════════════════════════════════════════════════════
			// SHARED — Content (all operations)
			// ════════════════════════════════════════════════════════════════════
			{
				displayName: 'Content',
				name: 'content',
				type: 'string',
				typeOptions: { rows: 5 },
				displayOptions: {
					show: {
						operation: ['infographic', 'comic', 'coverImage', 'xhsImages', 'slideDeck'],
					},
				},
				required: true,
				default: '',
				placeholder: 'Paste your article, story, or prompt here…',
				description: 'The main text content or prompt sent to the API',
			},

			// SHARED — Language (all operations)
			{
				displayName: 'Language',
				name: 'language',
				type: 'options',
				displayOptions: {
					show: {
						operation: ['infographic', 'comic', 'coverImage', 'xhsImages', 'slideDeck'],
					},
				},
				options: [
					{ name: 'Chinese', value: 'zh' },
					{ name: 'English', value: 'en' },
					{ name: 'French', value: 'fr' },
					{ name: 'German', value: 'de' },
					{ name: 'Japanese', value: 'ja' },
					{ name: 'Korean', value: 'ko' },
					{ name: 'Portuguese', value: 'pt' },
					{ name: 'Spanish', value: 'es' },
				],
				default: 'en',
				description: 'Output language for the generated content',
			},

			// SHARED — User tracking label (all operations)
			{
				displayName: 'User Label (Optional)',
				name: 'userLabel',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['infographic', 'comic', 'coverImage', 'xhsImages', 'slideDeck'],
					},
				},
				default: '',
				placeholder: 'e.g. user_123',
				description: 'Optional user tracking label passed as the "user" field',
			},

			// ════════════════════════════════════════════════════════════════════
			// 1. INFOGRAPHIC
			// ════════════════════════════════════════════════════════════════════
			{
				displayName: 'Layout',
				name: 'infographicLayout',
				type: 'options',
				displayOptions: { show: { operation: ['infographic'] } },
				options: [
					{ name: '(AI Auto-Select)', value: '' },
					{ name: 'Bento Grid', value: 'bento-grid' },
					{ name: 'Binary Comparison', value: 'binary-comparison' },
					{ name: 'Bridge', value: 'bridge' },
					{ name: 'Circular Flow', value: 'circular-flow' },
					{ name: 'Comic Strip', value: 'comic-strip' },
					{ name: 'Comparison Matrix', value: 'comparison-matrix' },
					{ name: 'Dashboard', value: 'dashboard' },
					{ name: 'Dense Modules', value: 'dense-modules' },
					{ name: 'Funnel', value: 'funnel' },
					{ name: 'Hierarchical Layers', value: 'hierarchical-layers' },
					{ name: 'Hub Spoke', value: 'hub-spoke' },
					{ name: 'Iceberg', value: 'iceberg' },
					{ name: 'Isometric Map', value: 'isometric-map' },
					{ name: 'Jigsaw', value: 'jigsaw' },
					{ name: 'Linear Progression', value: 'linear-progression' },
					{ name: 'Periodic Table', value: 'periodic-table' },
					{ name: 'Story Mountain', value: 'story-mountain' },
					{ name: 'Structural Breakdown', value: 'structural-breakdown' },
					{ name: 'Tree Branching', value: 'tree-branching' },
					{ name: 'Venn Diagram', value: 'venn-diagram' },
					{ name: 'Winding Roadmap', value: 'winding-roadmap' },
				],
				default: '',
				description: 'Visual layout. Leave blank to let the AI Director auto-select.',
			},
			{
				displayName: 'Style',
				name: 'infographicStyle',
				type: 'options',
				displayOptions: { show: { operation: ['infographic'] } },
				options: [
					{ name: '(AI Auto-Select)', value: '' },
					{ name: 'Aged Academia', value: 'aged-academia' },
					{ name: 'Bold Graphic', value: 'bold-graphic' },
					{ name: 'Chalkboard', value: 'chalkboard' },
					{ name: 'Claymation', value: 'claymation' },
					{ name: 'Corporate Memphis', value: 'corporate-memphis' },
					{ name: 'Craft Handmade', value: 'craft-handmade' },
					{ name: 'Cyberpunk Neon', value: 'cyberpunk-neon' },
					{ name: 'IKEA Manual', value: 'ikea-manual' },
					{ name: 'Kawaii', value: 'kawaii' },
					{ name: 'Knolling', value: 'knolling' },
					{ name: 'Lego Brick', value: 'lego-brick' },
					{ name: 'Morandi Journal', value: 'morandi-journal' },
					{ name: 'Origami', value: 'origami' },
					{ name: 'Pixel Art', value: 'pixel-art' },
					{ name: 'Pop Laboratory', value: 'pop-laboratory' },
					{ name: 'Retro Pop Grid', value: 'retro-pop-grid' },
					{ name: 'Storybook Watercolor', value: 'storybook-watercolor' },
					{ name: 'Subway Map', value: 'subway-map' },
					{ name: 'Technical Schematic', value: 'technical-schematic' },
					{ name: 'UI Wireframe', value: 'ui-wireframe' },
				],
				default: '',
				description: 'Visual style. Leave blank to let the AI Director auto-select.',
			},

			// ════════════════════════════════════════════════════════════════════
			// 2. COMIC
			// ════════════════════════════════════════════════════════════════════
			{
				displayName: 'Art Style',
				name: 'comicArt',
				type: 'options',
				displayOptions: { show: { operation: ['comic'] } },
				options: [
					{ name: '(AI Auto-Select)', value: '' },
					{ name: 'Chalk', value: 'chalk' },
					{ name: 'Ink Brush', value: 'ink-brush' },
					{ name: 'Ligne Claire', value: 'ligne-claire' },
					{ name: 'Manga', value: 'manga' },
					{ name: 'Realistic', value: 'realistic' },
				],
				default: '',
				description: 'Art style for the comic panels',
			},
			{
				displayName: 'Tone',
				name: 'comicTone',
				type: 'options',
				displayOptions: { show: { operation: ['comic'] } },
				options: [
					{ name: '(AI Auto-Select)', value: '' },
					{ name: 'Action', value: 'action' },
					{ name: 'Dramatic', value: 'dramatic' },
					{ name: 'Energetic', value: 'energetic' },
					{ name: 'Neutral', value: 'neutral' },
					{ name: 'Romantic', value: 'romantic' },
					{ name: 'Vintage', value: 'vintage' },
					{ name: 'Warm', value: 'warm' },
				],
				default: '',
				description: 'Emotional tone of the comic',
			},
			{
				displayName: 'Panel Layout',
				name: 'comicLayout',
				type: 'options',
				displayOptions: { show: { operation: ['comic'] } },
				options: [
					{ name: '(AI Auto-Select)', value: '' },
					{ name: 'Cinematic', value: 'cinematic' },
					{ name: 'Dense', value: 'dense' },
					{ name: 'Mixed', value: 'mixed' },
					{ name: 'Splash', value: 'splash' },
					{ name: 'Standard', value: 'standard' },
					{ name: 'Webtoon', value: 'webtoon' },
				],
				default: '',
				description: 'Panel layout style',
			},
			{
				displayName: 'Aspect Ratio',
				name: 'comicAspectRatio',
				type: 'options',
				displayOptions: { show: { operation: ['comic'] } },
				options: [
					{ name: '1:1 (Square)', value: '1:1' },
					{ name: '16:9 (Wide)', value: '16:9' },
					{ name: '3:4 (Portrait)', value: '3:4' },
					{ name: '4:3 (Landscape)', value: '4:3' },
				],
				default: '3:4',
				description: 'Output image aspect ratio',
			},

			// ════════════════════════════════════════════════════════════════════
			// 3. COVER IMAGE
			// ════════════════════════════════════════════════════════════════════
			{
				displayName: 'Type',
				name: 'coverType',
				type: 'options',
				displayOptions: { show: { operation: ['coverImage'] } },
				options: [
					{ name: '(AI Auto-Select)', value: '' },
					{ name: 'Conceptual', value: 'conceptual' },
					{ name: 'Hero', value: 'hero' },
					{ name: 'Metaphor', value: 'metaphor' },
					{ name: 'Minimal', value: 'minimal' },
					{ name: 'Scene', value: 'scene' },
					{ name: 'Typography', value: 'typography' },
				],
				default: '',
				description: 'Layout type for the cover image',
			},
			{
				displayName: 'Color Palette',
				name: 'coverPalette',
				type: 'options',
				displayOptions: { show: { operation: ['coverImage'] } },
				options: [
					{ name: '(AI Auto-Select)', value: '' },
					{ name: 'Cool', value: 'cool' },
					{ name: 'Dark', value: 'dark' },
					{ name: 'Earth', value: 'earth' },
					{ name: 'Elegant', value: 'elegant' },
					{ name: 'Mono', value: 'mono' },
					{ name: 'Pastel', value: 'pastel' },
					{ name: 'Retro', value: 'retro' },
					{ name: 'Vivid', value: 'vivid' },
					{ name: 'Warm', value: 'warm' },
				],
				default: '',
				description: 'Color palette for the cover image',
			},
			{
				displayName: 'Rendering',
				name: 'coverRendering',
				type: 'options',
				displayOptions: { show: { operation: ['coverImage'] } },
				options: [
					{ name: '(AI Auto-Select)', value: '' },
					{ name: 'Chalk', value: 'chalk' },
					{ name: 'Digital', value: 'digital' },
					{ name: 'Flat Vector', value: 'flat-vector' },
					{ name: 'Hand Drawn', value: 'hand-drawn' },
					{ name: 'Painterly', value: 'painterly' },
					{ name: 'Pixel', value: 'pixel' },
				],
				default: '',
				description: 'Visual rendering style',
			},
			{
				displayName: 'Mood',
				name: 'coverMood',
				type: 'options',
				displayOptions: { show: { operation: ['coverImage'] } },
				options: [
					{ name: '(AI Auto-Select)', value: '' },
					{ name: 'Balanced', value: 'balanced' },
					{ name: 'Bold', value: 'bold' },
					{ name: 'Subtle', value: 'subtle' },
				],
				default: '',
				description: 'Overall mood / impact level',
			},
			{
				displayName: 'Text Density',
				name: 'coverTextDensity',
				type: 'options',
				displayOptions: { show: { operation: ['coverImage'] } },
				options: [
					{ name: '(AI Auto-Select)', value: '' },
					{ name: 'None', value: 'none' },
					{ name: 'Text Rich', value: 'text-rich' },
					{ name: 'Title + Subtitle', value: 'title-subtitle' },
					{ name: 'Title Only', value: 'title-only' },
				],
				default: '',
				description: 'How much text overlay to include',
			},
			{
				displayName: 'Aspect Ratio',
				name: 'coverAspectRatio',
				type: 'options',
				displayOptions: { show: { operation: ['coverImage'] } },
				options: [
					{ name: '1:1 (Square)', value: '1:1' },
					{ name: '16:9 (Wide)', value: '16:9' },
					{ name: '4:3', value: '4:3' },
					{ name: '9:16 (Portrait)', value: '9:16' },
				],
				default: '16:9',
				description: 'Output image aspect ratio',
			},

			// ════════════════════════════════════════════════════════════════════
			// 4. XHS IMAGES
			// ════════════════════════════════════════════════════════════════════
			{
				displayName: 'Style',
				name: 'xhsStyle',
				type: 'options',
				displayOptions: { show: { operation: ['xhsImages'] } },
				options: [
					{ name: '(AI Auto-Select)', value: '' },
					{ name: 'Bold', value: 'bold' },
					{ name: 'Chalkboard', value: 'chalkboard' },
					{ name: 'Cute', value: 'cute' },
					{ name: 'Fresh', value: 'fresh' },
					{ name: 'Minimal', value: 'minimal' },
					{ name: 'Notion', value: 'notion' },
					{ name: 'Pop', value: 'pop' },
					{ name: 'Retro', value: 'retro' },
					{ name: 'Study Notes', value: 'study-notes' },
					{ name: 'Warm', value: 'warm' },
				],
				default: '',
				description: 'Visual preset for the carousel pages',
			},
			{
				displayName: 'Layout',
				name: 'xhsLayout',
				type: 'options',
				displayOptions: { show: { operation: ['xhsImages'] } },
				options: [
					{ name: '(AI Auto-Select)', value: '' },
					{ name: 'Canvas', value: 'canvas' },
					{ name: 'Decorations', value: 'decorations' },
					{ name: 'Image Effects', value: 'image-effects' },
					{ name: 'Typography', value: 'typography' },
				],
				default: '',
				description: 'Information hierarchy layout',
			},
			{
				displayName: 'Aspect Ratio',
				name: 'xhsAspectRatio',
				type: 'options',
				displayOptions: { show: { operation: ['xhsImages'] } },
				options: [
					{ name: '1:1 (Square)', value: '1:1' },
					{ name: '3:4 (Portrait)', value: '3:4' },
					{ name: '4:3 (Landscape)', value: '4:3' },
					{ name: '9:16 (Vertical)', value: '9:16' },
				],
				default: '3:4',
				description: 'Output image aspect ratio',
			},

			// ════════════════════════════════════════════════════════════════════
			// 5. SLIDE DECK
			// ════════════════════════════════════════════════════════════════════
			{
				displayName: 'Style',
				name: 'slideDeckStyle',
				type: 'options',
				displayOptions: { show: { operation: ['slideDeck'] } },
				options: [
					{ name: '(AI Auto-Select)', value: '' },
					{ name: 'Blueprint', value: 'blueprint' },
					{ name: 'Bold Editorial', value: 'bold-editorial' },
					{ name: 'Chalkboard', value: 'chalkboard' },
					{ name: 'Corporate', value: 'corporate' },
					{ name: 'Dark Atmospheric', value: 'dark-atmospheric' },
					{ name: 'Editorial Infographic', value: 'editorial-infographic' },
					{ name: 'Fantasy Animation', value: 'fantasy-animation' },
					{ name: 'Intuition Machine', value: 'intuition-machine' },
					{ name: 'Minimal', value: 'minimal' },
					{ name: 'Notion', value: 'notion' },
					{ name: 'Pixel Art', value: 'pixel-art' },
					{ name: 'Scientific', value: 'scientific' },
					{ name: 'Sketch Notes', value: 'sketch-notes' },
					{ name: 'Vector Illustration', value: 'vector-illustration' },
					{ name: 'Vintage', value: 'vintage' },
					{ name: 'Watercolor', value: 'watercolor' },
				],
				default: '',
				description: 'Presentation design style',
			},
			{
				displayName: 'Aspect Ratio',
				name: 'slideDeckAspectRatio',
				type: 'options',
				displayOptions: { show: { operation: ['slideDeck'] } },
				options: [
					{ name: '1:1 (Square)', value: '1:1' },
					{ name: '16:9 (Widescreen)', value: '16:9' },
					{ name: '4:3 (Classic)', value: '4:3' },
				],
				default: '16:9',
				description: 'Slide aspect ratio',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const operation = this.getNodeParameter('operation', i) as string;

				const str = (key: string) => (this.getNodeParameter(key, i) as string).trim();

				const content   = str('content');
				const language  = str('language');
				const userLabel = str('userLabel');

				if (!content) {
					throw new NodeOperationError(this.getNode(), '"Content" is required.', { itemIndex: i });
				}

				const options: IDataObject = {};
				if (language) options.language = language;

				// ── Per-operation options ────────────────────────────────────────
				if (operation === 'infographic') {
					const layout = str('infographicLayout');
					const style  = str('infographicStyle');
					if (layout) options.layout = layout;
					if (style)  options.style  = style;
				}

				if (operation === 'comic') {
					const art    = str('comicArt');
					const tone   = str('comicTone');
					const layout = str('comicLayout');
					const ar     = str('comicAspectRatio');
					if (art)    options.art         = art;
					if (tone)   options.tone        = tone;
					if (layout) options.layout      = layout;
					if (ar)     options.aspectRatio = ar;
				}

				if (operation === 'coverImage') {
					const type        = str('coverType');
					const palette     = str('coverPalette');
					const rendering   = str('coverRendering');
					const mood        = str('coverMood');
					const textDensity = str('coverTextDensity');
					const ar          = str('coverAspectRatio');
					if (type)        options.type        = type;
					if (palette)     options.palette     = palette;
					if (rendering)   options.rendering   = rendering;
					if (mood)        options.mood        = mood;
					if (textDensity) options.textDensity = textDensity;
					if (ar)          options.aspectRatio = ar;
				}

				if (operation === 'xhsImages') {
					const style  = str('xhsStyle');
					const layout = str('xhsLayout');
					const ar     = str('xhsAspectRatio');
					if (style)  options.style       = style;
					if (layout) options.layout      = layout;
					if (ar)     options.aspectRatio = ar;
				}

				if (operation === 'slideDeck') {
					const style = str('slideDeckStyle');
					const ar    = str('slideDeckAspectRatio');
					if (style) options.style       = style;
					if (ar)    options.aspectRatio = ar;
				}

				// ── Skill map ────────────────────────────────────────────────────
				const skillMap: Record<string, string> = {
					infographic: 'baoyu-infographic',
					comic:       'baoyu-comic',
					coverImage:  'baoyu-cover-image',
					xhsImages:   'baoyu-xhs-images',
					slideDeck:   'baoyu-slide-deck',
				};

				const skill = skillMap[operation];
				if (!skill) {
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`, { itemIndex: i });
				}

				const body: IDataObject = { skill, content, options };
				if (userLabel) body.user = userLabel;

				const resp = await this.helpers.httpRequestWithAuthentication.call(
					this,
					'headlessSaasApi',
					{
						method: 'POST',
						baseURL: BASE_URL,
						url: '/api/v1/generate-image',
						body,
						json: true,
					},
				);

				const normalizedResp = Array.isArray(resp) ? resp[0] : resp;
				if (!normalizedResp?.success) {
					throw new NodeOperationError(
						this.getNode(),
						normalizedResp?.message ?? 'API call failed.',
						{ itemIndex: i },
					);
				}

				// Normalise API variants (single image, multi-image, deck metadata, and credits).
				const data = (normalizedResp.data ?? normalizedResp) as IDataObject;
				const imageUrl = typeof data.imageUrl === 'string' ? data.imageUrl : null;
				const imageUrls = Array.isArray(data.imageUrls)
					? data.imageUrls.filter((url): url is string => typeof url === 'string')
					: typeof data.imageUrls === 'string'
						? [data.imageUrls]
					: imageUrl
						? [imageUrl]
						: [];
				const pdfUrl = typeof data.pdfUrl === 'string' ? data.pdfUrl : null;
				const usage = (typeof data.usage === 'object' && data.usage !== null)
					? (data.usage as IDataObject)
					: null;

				returnData.push({
					json: {
						success: true,
						operation,
						skill,
						imageUrls,
						firstImageUrl:    imageUrls[0] ?? null,
						imageUrl:         imageUrl ?? imageUrls[0] ?? null,
						pdfUrl,
						usage,
						creditsRemaining: data.creditsRemaining ?? normalizedResp.creditsRemaining ?? null,
						apiData: data,
					},
					pairedItem: { item: i },
				});

			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: (error as Error).message },
						pairedItem: { item: i },
					});
					continue;
				}
				throw new NodeApiError(this.getNode(), error as JsonObject, { itemIndex: i });
			}
		}

		return [returnData];
	}
}
