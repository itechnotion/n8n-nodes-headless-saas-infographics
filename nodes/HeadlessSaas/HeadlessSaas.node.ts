import type {
	IExecuteFunctions,
	ILoadOptionsFunctions,
	INodeExecutionData,
	INodeListSearchItems,
	INodeListSearchResult,
	INodeType,
	INodeTypeDescription,
	IDataObject,
	JsonObject,
} from 'n8n-workflow';

import { NodeApiError, NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';

const BASE_URL = 'https://headless-sass-bzzrfsh6ra-el.a.run.app';

// ── Static option lists ──────────────────────────────────────────────────────

const LANGUAGES: INodeListSearchItems[] = [
	{ name: 'Chinese',    value: 'zh' },
	{ name: 'English',    value: 'en' },
	{ name: 'French',     value: 'fr' },
	{ name: 'German',     value: 'de' },
	{ name: 'Japanese',   value: 'ja' },
	{ name: 'Korean',     value: 'ko' },
	{ name: 'Portuguese', value: 'pt' },
	{ name: 'Spanish',    value: 'es' },
];

const INFOGRAPHIC_LAYOUTS: INodeListSearchItems[] = [
	{ name: '(AI Auto-Select)',     value: '' },
	{ name: 'Bento Grid',           value: 'bento-grid' },
	{ name: 'Binary Comparison',    value: 'binary-comparison' },
	{ name: 'Bridge',               value: 'bridge' },
	{ name: 'Circular Flow',        value: 'circular-flow' },
	{ name: 'Comic Strip',          value: 'comic-strip' },
	{ name: 'Comparison Matrix',    value: 'comparison-matrix' },
	{ name: 'Dashboard',            value: 'dashboard' },
	{ name: 'Dense Modules',        value: 'dense-modules' },
	{ name: 'Funnel',               value: 'funnel' },
	{ name: 'Hierarchical Layers',  value: 'hierarchical-layers' },
	{ name: 'Hub Spoke',            value: 'hub-spoke' },
	{ name: 'Iceberg',              value: 'iceberg' },
	{ name: 'Isometric Map',        value: 'isometric-map' },
	{ name: 'Jigsaw',               value: 'jigsaw' },
	{ name: 'Linear Progression',   value: 'linear-progression' },
	{ name: 'Periodic Table',       value: 'periodic-table' },
	{ name: 'Story Mountain',       value: 'story-mountain' },
	{ name: 'Structural Breakdown', value: 'structural-breakdown' },
	{ name: 'Tree Branching',       value: 'tree-branching' },
	{ name: 'Venn Diagram',         value: 'venn-diagram' },
	{ name: 'Winding Roadmap',      value: 'winding-roadmap' },
];

const INFOGRAPHIC_STYLES: INodeListSearchItems[] = [
	{ name: '(AI Auto-Select)',     value: '' },
	{ name: 'Aged Academia',        value: 'aged-academia' },
	{ name: 'Bold Graphic',         value: 'bold-graphic' },
	{ name: 'Chalkboard',           value: 'chalkboard' },
	{ name: 'Claymation',           value: 'claymation' },
	{ name: 'Corporate Memphis',    value: 'corporate-memphis' },
	{ name: 'Craft Handmade',       value: 'craft-handmade' },
	{ name: 'Cyberpunk Neon',       value: 'cyberpunk-neon' },
	{ name: 'IKEA Manual',          value: 'ikea-manual' },
	{ name: 'Kawaii',               value: 'kawaii' },
	{ name: 'Knolling',             value: 'knolling' },
	{ name: 'Lego Brick',           value: 'lego-brick' },
	{ name: 'Morandi Journal',      value: 'morandi-journal' },
	{ name: 'Origami',              value: 'origami' },
	{ name: 'Pixel Art',            value: 'pixel-art' },
	{ name: 'Pop Laboratory',       value: 'pop-laboratory' },
	{ name: 'Retro Pop Grid',       value: 'retro-pop-grid' },
	{ name: 'Storybook Watercolor', value: 'storybook-watercolor' },
	{ name: 'Subway Map',           value: 'subway-map' },
	{ name: 'Technical Schematic',  value: 'technical-schematic' },
	{ name: 'UI Wireframe',         value: 'ui-wireframe' },
];

const COMIC_ART_STYLES: INodeListSearchItems[] = [
	{ name: '(AI Auto-Select)', value: '' },
	{ name: 'Chalk',            value: 'chalk' },
	{ name: 'Ink Brush',        value: 'ink-brush' },
	{ name: 'Ligne Claire',     value: 'ligne-claire' },
	{ name: 'Manga',            value: 'manga' },
	{ name: 'Realistic',        value: 'realistic' },
];

const COMIC_TONES: INodeListSearchItems[] = [
	{ name: '(AI Auto-Select)', value: '' },
	{ name: 'Action',           value: 'action' },
	{ name: 'Dramatic',         value: 'dramatic' },
	{ name: 'Energetic',        value: 'energetic' },
	{ name: 'Neutral',          value: 'neutral' },
	{ name: 'Romantic',         value: 'romantic' },
	{ name: 'Vintage',          value: 'vintage' },
	{ name: 'Warm',             value: 'warm' },
];

const COMIC_LAYOUTS: INodeListSearchItems[] = [
	{ name: '(AI Auto-Select)', value: '' },
	{ name: 'Cinematic',        value: 'cinematic' },
	{ name: 'Dense',            value: 'dense' },
	{ name: 'Mixed',            value: 'mixed' },
	{ name: 'Splash',           value: 'splash' },
	{ name: 'Standard',         value: 'standard' },
	{ name: 'Webtoon',          value: 'webtoon' },
];

const COMIC_ASPECT_RATIOS: INodeListSearchItems[] = [
	{ name: '1:1 (Square)',    value: '1:1' },
	{ name: '16:9 (Wide)',     value: '16:9' },
	{ name: '3:4 (Portrait)',  value: '3:4' },
	{ name: '4:3 (Landscape)', value: '4:3' },
];

const COVER_TYPES: INodeListSearchItems[] = [
	{ name: '(AI Auto-Select)', value: '' },
	{ name: 'Conceptual',       value: 'conceptual' },
	{ name: 'Hero',             value: 'hero' },
	{ name: 'Metaphor',         value: 'metaphor' },
	{ name: 'Minimal',          value: 'minimal' },
	{ name: 'Scene',            value: 'scene' },
	{ name: 'Typography',       value: 'typography' },
];

const COVER_PALETTES: INodeListSearchItems[] = [
	{ name: '(AI Auto-Select)', value: '' },
	{ name: 'Cool',             value: 'cool' },
	{ name: 'Dark',             value: 'dark' },
	{ name: 'Earth',            value: 'earth' },
	{ name: 'Elegant',          value: 'elegant' },
	{ name: 'Mono',             value: 'mono' },
	{ name: 'Pastel',           value: 'pastel' },
	{ name: 'Retro',            value: 'retro' },
	{ name: 'Vivid',            value: 'vivid' },
	{ name: 'Warm',             value: 'warm' },
];

const COVER_RENDERINGS: INodeListSearchItems[] = [
	{ name: '(AI Auto-Select)', value: '' },
	{ name: 'Chalk',            value: 'chalk' },
	{ name: 'Digital',          value: 'digital' },
	{ name: 'Flat Vector',      value: 'flat-vector' },
	{ name: 'Hand Drawn',       value: 'hand-drawn' },
	{ name: 'Painterly',        value: 'painterly' },
	{ name: 'Pixel',            value: 'pixel' },
];

const COVER_MOODS: INodeListSearchItems[] = [
	{ name: '(AI Auto-Select)', value: '' },
	{ name: 'Balanced',         value: 'balanced' },
	{ name: 'Bold',             value: 'bold' },
	{ name: 'Subtle',           value: 'subtle' },
];

const COVER_TEXT_DENSITIES: INodeListSearchItems[] = [
	{ name: '(AI Auto-Select)', value: '' },
	{ name: 'None',             value: 'none' },
	{ name: 'Text Rich',        value: 'text-rich' },
	{ name: 'Title + Subtitle', value: 'title-subtitle' },
	{ name: 'Title Only',       value: 'title-only' },
];

const COVER_ASPECT_RATIOS: INodeListSearchItems[] = [
	{ name: '1:1 (Square)',    value: '1:1' },
	{ name: '16:9 (Wide)',     value: '16:9' },
	{ name: '4:3',             value: '4:3' },
	{ name: '9:16 (Portrait)', value: '9:16' },
];

const XHS_STYLES: INodeListSearchItems[] = [
	{ name: '(AI Auto-Select)', value: '' },
	{ name: 'Bold',             value: 'bold' },
	{ name: 'Chalkboard',       value: 'chalkboard' },
	{ name: 'Cute',             value: 'cute' },
	{ name: 'Fresh',            value: 'fresh' },
	{ name: 'Minimal',          value: 'minimal' },
	{ name: 'Notion',           value: 'notion' },
	{ name: 'Pop',              value: 'pop' },
	{ name: 'Retro',            value: 'retro' },
	{ name: 'Study Notes',      value: 'study-notes' },
	{ name: 'Warm',             value: 'warm' },
];

const XHS_LAYOUTS: INodeListSearchItems[] = [
	{ name: '(AI Auto-Select)', value: '' },
	{ name: 'Canvas',           value: 'canvas' },
	{ name: 'Decorations',      value: 'decorations' },
	{ name: 'Image Effects',    value: 'image-effects' },
	{ name: 'Typography',       value: 'typography' },
];

const XHS_ASPECT_RATIOS: INodeListSearchItems[] = [
	{ name: '1:1 (Square)',    value: '1:1' },
	{ name: '3:4 (Portrait)',  value: '3:4' },
	{ name: '4:3 (Landscape)', value: '4:3' },
	{ name: '9:16 (Vertical)', value: '9:16' },
];

const SLIDE_DECK_STYLES: INodeListSearchItems[] = [
	{ name: '(AI Auto-Select)',      value: '' },
	{ name: 'Blueprint',             value: 'blueprint' },
	{ name: 'Bold Editorial',        value: 'bold-editorial' },
	{ name: 'Chalkboard',            value: 'chalkboard' },
	{ name: 'Corporate',             value: 'corporate' },
	{ name: 'Dark Atmospheric',      value: 'dark-atmospheric' },
	{ name: 'Editorial Infographic', value: 'editorial-infographic' },
	{ name: 'Fantasy Animation',     value: 'fantasy-animation' },
	{ name: 'Intuition Machine',     value: 'intuition-machine' },
	{ name: 'Minimal',               value: 'minimal' },
	{ name: 'Notion',                value: 'notion' },
	{ name: 'Pixel Art',             value: 'pixel-art' },
	{ name: 'Scientific',            value: 'scientific' },
	{ name: 'Sketch Notes',          value: 'sketch-notes' },
	{ name: 'Vector Illustration',   value: 'vector-illustration' },
	{ name: 'Vintage',               value: 'vintage' },
	{ name: 'Watercolor',            value: 'watercolor' },
];

const SLIDE_DECK_ASPECT_RATIOS: INodeListSearchItems[] = [
	{ name: '1:1 (Square)',      value: '1:1' },
	{ name: '16:9 (Widescreen)', value: '16:9' },
	{ name: '4:3 (Classic)',     value: '4:3' },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

function filterList(items: INodeListSearchItems[], filter?: string): INodeListSearchResult {
	const q = (filter ?? '').toLowerCase();
	const results = q ? items.filter((i) => i.name.toLowerCase().includes(q)) : items;
	return { results };
}

type DisplayOptions = { show: Record<string, string[]> };

function makeResourceLocator(
	displayName: string,
	name: string,
	listSearchMethod: string,
	defaultValue: string,
	description: string,
	displayOptions: DisplayOptions,
) {
	return {
		displayName,
		name,
		type: 'resourceLocator' as const,
		default: { mode: 'list', value: defaultValue },
		description,
		displayOptions,
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list' as const,
				typeOptions: { searchListMethod: listSearchMethod, searchable: true },
			},
			{
				displayName: 'Expression / Value',
				name: 'id',
				type: 'string' as const,
				hint: 'Enter a value or drag an expression here',
				placeholder: 'e.g. bold-graphic',
			},
		],
	};
}

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
				noDataExpression: true,
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

			// SHARED — Language
			makeResourceLocator(
				'Language',
				'language',
				'getLanguages',
				'en',
				'Output language for the generated content',
				{ show: { operation: ['infographic', 'comic', 'coverImage', 'xhsImages', 'slideDeck'] } },
			),

			// SHARED — User tracking label
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
			makeResourceLocator(
				'Layout',
				'infographicLayout',
				'getInfographicLayouts',
				'',
				'Visual layout. Leave blank to let the AI Director auto-select.',
				{ show: { operation: ['infographic'] } },
			),
			makeResourceLocator(
				'Style',
				'infographicStyle',
				'getInfographicStyles',
				'',
				'Visual style. Leave blank to let the AI Director auto-select.',
				{ show: { operation: ['infographic'] } },
			),

			// ════════════════════════════════════════════════════════════════════
			// 2. COMIC
			// ════════════════════════════════════════════════════════════════════
			makeResourceLocator(
				'Art Style',
				'comicArt',
				'getComicArtStyles',
				'',
				'Art style for the comic panels',
				{ show: { operation: ['comic'] } },
			),
			makeResourceLocator(
				'Tone',
				'comicTone',
				'getComicTones',
				'',
				'Emotional tone of the comic',
				{ show: { operation: ['comic'] } },
			),
			makeResourceLocator(
				'Panel Layout',
				'comicLayout',
				'getComicLayouts',
				'',
				'Panel layout style',
				{ show: { operation: ['comic'] } },
			),
			makeResourceLocator(
				'Aspect Ratio',
				'comicAspectRatio',
				'getComicAspectRatios',
				'3:4',
				'Output image aspect ratio',
				{ show: { operation: ['comic'] } },
			),

			// ════════════════════════════════════════════════════════════════════
			// 3. COVER IMAGE
			// ════════════════════════════════════════════════════════════════════
			makeResourceLocator(
				'Type',
				'coverType',
				'getCoverTypes',
				'',
				'Layout type for the cover image',
				{ show: { operation: ['coverImage'] } },
			),
			makeResourceLocator(
				'Color Palette',
				'coverPalette',
				'getCoverPalettes',
				'',
				'Color palette for the cover image',
				{ show: { operation: ['coverImage'] } },
			),
			makeResourceLocator(
				'Rendering',
				'coverRendering',
				'getCoverRenderings',
				'',
				'Visual rendering style',
				{ show: { operation: ['coverImage'] } },
			),
			makeResourceLocator(
				'Mood',
				'coverMood',
				'getCoverMoods',
				'',
				'Overall mood / impact level',
				{ show: { operation: ['coverImage'] } },
			),
			makeResourceLocator(
				'Text Density',
				'coverTextDensity',
				'getCoverTextDensities',
				'',
				'How much text overlay to include',
				{ show: { operation: ['coverImage'] } },
			),
			makeResourceLocator(
				'Aspect Ratio',
				'coverAspectRatio',
				'getCoverAspectRatios',
				'16:9',
				'Output image aspect ratio',
				{ show: { operation: ['coverImage'] } },
			),

			// ════════════════════════════════════════════════════════════════════
			// 4. XHS IMAGES
			// ════════════════════════════════════════════════════════════════════
			makeResourceLocator(
				'Style',
				'xhsStyle',
				'getXhsStyles',
				'',
				'Visual preset for the carousel pages',
				{ show: { operation: ['xhsImages'] } },
			),
			makeResourceLocator(
				'Layout',
				'xhsLayout',
				'getXhsLayouts',
				'',
				'Information hierarchy layout',
				{ show: { operation: ['xhsImages'] } },
			),
			makeResourceLocator(
				'Aspect Ratio',
				'xhsAspectRatio',
				'getXhsAspectRatios',
				'3:4',
				'Output image aspect ratio',
				{ show: { operation: ['xhsImages'] } },
			),

			// ════════════════════════════════════════════════════════════════════
			// 5. SLIDE DECK
			// ════════════════════════════════════════════════════════════════════
			makeResourceLocator(
				'Style',
				'slideDeckStyle',
				'getSlideDeckStyles',
				'',
				'Presentation design style',
				{ show: { operation: ['slideDeck'] } },
			),
			makeResourceLocator(
				'Aspect Ratio',
				'slideDeckAspectRatio',
				'getSlideDeckAspectRatios',
				'16:9',
				'Slide aspect ratio',
				{ show: { operation: ['slideDeck'] } },
			),
		],
	};

	// ── listSearch methods (populate dropdowns + support search) ────────────
	methods = {
		listSearch: {
			async getLanguages(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult> {
				return filterList(LANGUAGES, filter);
			},
			async getInfographicLayouts(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult> {
				return filterList(INFOGRAPHIC_LAYOUTS, filter);
			},
			async getInfographicStyles(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult> {
				return filterList(INFOGRAPHIC_STYLES, filter);
			},
			async getComicArtStyles(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult> {
				return filterList(COMIC_ART_STYLES, filter);
			},
			async getComicTones(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult> {
				return filterList(COMIC_TONES, filter);
			},
			async getComicLayouts(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult> {
				return filterList(COMIC_LAYOUTS, filter);
			},
			async getComicAspectRatios(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult> {
				return filterList(COMIC_ASPECT_RATIOS, filter);
			},
			async getCoverTypes(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult> {
				return filterList(COVER_TYPES, filter);
			},
			async getCoverPalettes(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult> {
				return filterList(COVER_PALETTES, filter);
			},
			async getCoverRenderings(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult> {
				return filterList(COVER_RENDERINGS, filter);
			},
			async getCoverMoods(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult> {
				return filterList(COVER_MOODS, filter);
			},
			async getCoverTextDensities(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult> {
				return filterList(COVER_TEXT_DENSITIES, filter);
			},
			async getCoverAspectRatios(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult> {
				return filterList(COVER_ASPECT_RATIOS, filter);
			},
			async getXhsStyles(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult> {
				return filterList(XHS_STYLES, filter);
			},
			async getXhsLayouts(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult> {
				return filterList(XHS_LAYOUTS, filter);
			},
			async getXhsAspectRatios(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult> {
				return filterList(XHS_ASPECT_RATIOS, filter);
			},
			async getSlideDeckStyles(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult> {
				return filterList(SLIDE_DECK_STYLES, filter);
			},
			async getSlideDeckAspectRatios(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult> {
				return filterList(SLIDE_DECK_ASPECT_RATIOS, filter);
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const operation = this.getNodeParameter('operation', i) as string;

				// Helper for plain string fields
				const str = (key: string) => (this.getNodeParameter(key, i) as string).trim();

				// Helper for resourceLocator fields — handles both list mode and expression/id mode
				const rl = (key: string): string => {
					const param = this.getNodeParameter(key, i) as { mode: string; value: string } | string;
					if (typeof param === 'string') return param.trim();
					return (param?.value ?? '').toString().trim();
				};

				const content   = str('content');
				const language  = rl('language');
				const userLabel = str('userLabel');

				if (!content) {
					throw new NodeOperationError(this.getNode(), '"Content" is required.', { itemIndex: i });
				}

				const options: IDataObject = {};
				if (language) options.language = language;

				// ── Per-operation options ────────────────────────────────────────
				if (operation === 'infographic') {
					const layout = rl('infographicLayout');
					const style  = rl('infographicStyle');
					if (layout) options.layout = layout;
					if (style)  options.style  = style;
				}

				if (operation === 'comic') {
					const art    = rl('comicArt');
					const tone   = rl('comicTone');
					const layout = rl('comicLayout');
					const ar     = rl('comicAspectRatio');
					if (art)    options.art         = art;
					if (tone)   options.tone        = tone;
					if (layout) options.layout      = layout;
					if (ar)     options.aspectRatio = ar;
				}

				if (operation === 'coverImage') {
					const type        = rl('coverType');
					const palette     = rl('coverPalette');
					const rendering   = rl('coverRendering');
					const mood        = rl('coverMood');
					const textDensity = rl('coverTextDensity');
					const ar          = rl('coverAspectRatio');
					if (type)        options.type        = type;
					if (palette)     options.palette     = palette;
					if (rendering)   options.rendering   = rendering;
					if (mood)        options.mood        = mood;
					if (textDensity) options.textDensity = textDensity;
					if (ar)          options.aspectRatio = ar;
				}

				if (operation === 'xhsImages') {
					const style  = rl('xhsStyle');
					const layout = rl('xhsLayout');
					const ar     = rl('xhsAspectRatio');
					if (style)  options.style       = style;
					if (layout) options.layout      = layout;
					if (ar)     options.aspectRatio = ar;
				}

				if (operation === 'slideDeck') {
					const style = rl('slideDeckStyle');
					const ar    = rl('slideDeckAspectRatio');
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
