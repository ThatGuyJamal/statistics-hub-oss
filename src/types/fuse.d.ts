// code below was taken from: https://github.com/Lioness100/sapphire-template/blob/e2bccc270db641245160bedbd2f06fffe55bffe9/src/lib/types/fuse.basic.d.ts

// `fuse.basic` essentially removes the ability to parse special query syntax, which is unneeded for our use-case.
// Theoretically this should make searches faster.
declare module 'fuse.js/dist/fuse.basic.min.js' {
	// All types are the same.
	export { default } from 'fuse.js';
}