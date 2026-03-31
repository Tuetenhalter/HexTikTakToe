

## Bot 0

- Depth: 1
	- Count: 991
	- Time: 318ms
- Depht: 2
    - didnt finish

## Bot 1

- Alpha Beta
- sort by distance to 0,0

- Depth: 1
	- Count: 991
	- Time: 345ms
- Depth: 2
	- Count: 18170
	- Time: 6617ms



## Bot 2

- Alpha Beta
- sort by distance to 0,0
- eval only around change

- Depth: 1
	- Count: 991
	- Time: 78ms
- Depth: 2
	- Count: 19070
	- Time: 1539ms
- Depth: 3
	- Count: 4380459
	- Time: 429279ms

## Bot 3

- sort all moves with evalPos
- added force move and win move

	- Depth: 1
		- Count: 991
		- Time: 69ms
	- Depth: 2
		- Count: 8319
		- Time: 5250ms
	- Depth: 3
		- Count: 256446
		- Time: 86737ms

- only look at the best 30
	- Depth: 1
		- Count: 31
		- Time: 5ms
	- Depth: 2
		- Count: 177
		- Time: 104ms
	- Depth: 3
		- Count: 469
		- Time: 574ms
	- Depth: 4
		- Count: 3165
		- Time: 1822ms
	- Depth: 5
		- Count: 48124
		- Time: 57156ms

# test with foced move
r,0,-2,-1,e,e,e,r,n,e,e,r,b,n,e,r,b,e,n,e,b,e,e,n,b,e,e,e

- without forced move
	- Depth: 1
		- Count: 5
		- Time: 1ms
	- Depth: 2
		- Count: 980
		- Time: 61ms
	- Depth: 3
		- Count: 132474
		- Time: 8815ms

- with forced move
	- Depth: 1
		- Count: 562
		- Time: 32ms
	- Depth: 2
		- Count: 169402
		- Time: 12990ms