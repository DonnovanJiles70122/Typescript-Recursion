/* ----------------------------------------------------- **
### Problem 1a:
Write a function that splits an array into two "halves".
If there are an odd number of elements, put the extra element in the left half.
Example 1:
    splitArrayOnce([]) = 
        [ [], [] ]
Example 2:
    splitArrayOnce([1]) =
        [ [ 1 ], [] ]
Example 3:
    splitArrayOnce(["hello", "world"]) =
        [ [ 'hello' ], [ 'world' ] ]
Example 4:
    splitArrayOnce(["csc600", "is", "fun"]) =
        [ [ 'csc600', 'is' ], [ 'fun' ] ]
Example 5:
    splitArrayOnce([3, 2, 1, 4]) =
        [ [ 3, 2 ], [ 1, 4 ] ]
** ----------------------------------------------------- */

export function splitArrayOnce<T>(arr: T[]): [T[], T[]] {

    let right: T[] = [];
    let left: T[] = [];
    const half = Math.ceil(arr.length / 2);

    right = arr.slice(0, half);
    left = arr.slice(half);
    
    return [right, left];
}

/* ----------------------------------------------------- **
### Problem 1b:
Write a function that splits an array into two "halves" and then
splits each half respectively again into two "havles". Thus you will
end up with 4 "quarters" at the end. As before, if there are an odd
number of elements, put the extra element in the left half.
Example 1:
    splitArrayTwice([]) =
        [ [ [], [] ], [ [], [] ] ]
Example 2:
    splitArrayTwice([1]) =
        [ [ [ 1 ], [] ], [ [], [] ] ]
Example 3:
    splitArrayTwice(["hello", "world"]) =
        [ [ [ 'hello' ], [] ], [ [ 'world' ], [] ] ]
Example 4:
    splitArrayTwice(["csc600", "is", "fun"]) =
        [ [ [ 'csc600' ], [ 'is' ] ], [ [ 'fun' ], [] ] ]
Example 5:
    splitArrayTwice([3, 2, 1, 4]) =
        [ [ [ 3 ], [ 2 ] ], [ [ 1 ], [ 4 ] ] ]
** ----------------------------------------------------- */

export function splitArrayTwice<T>(arr: T[]): [[T[], T[]], [T[], T[]]] {
    const half = Math.ceil(arr.length / 2);
    const forth = Math.ceil(half / 2);

    let first: T[] = [];
    let second: T[] = [];
    let third: T[] = [];
    let last: T[] = [];

    first = arr.slice(0, forth);
    second = arr.slice(forth, half);
    third = arr.slice(half, half+forth);
    last = arr.slice(half+forth);

    return [[first, second], [third, last]]
}

/* ==========================================================================  **
## Problem 2: Recursive functions with arrays
What if you had to write splitArrayThree? That would be quite the mess.
In this problem, we'll use an algebraic data types (ADTs) called
`NestedArray<T>` to encode an arbitrary sequence of nested arrays that
hold elements of type `T`.
** ============================================================================ */

export type NestedArray<T> =
    {
        tag: "LEAF"
    }
|   {
        tag: "NODE",
        contents: T,
        left: NestedArray<T>,
        right: NestedArray<T>
    };

export function mkNALeaf<T>(): NestedArray<T> {
    return {
        tag: "LEAF"
    };
}

export function mkNANode<T>(contents: T, left: NestedArray<T>, right: NestedArray<T>): NestedArray<T> {
    return {
        tag: "NODE",
        contents: contents, 
        left: left,
        right: right
    };
}

export const tr1 =
    mkNALeaf();

export const tr2 = 
    mkNANode(
        1,
        mkNALeaf(),
        mkNALeaf()
    );

export const tr3 =
    mkNANode(
        "hello",
        mkNALeaf(),
        mkNANode(
            "world",
            mkNALeaf(),
            mkNALeaf()
        )
    );

export const tr4 =
    mkNANode(
        'is',
        mkNANode(
            'csc600',
            mkNALeaf(),
            mkNALeaf()
        ),
        mkNANode(
            'fun',
            mkNALeaf(),
            mkNALeaf()
        )
    )

export const tr5 =
    mkNANode(
        2,
        mkNANode(
            3,
            mkNALeaf(),
            mkNALeaf()
        ),
        mkNANode(
            1,
            mkNALeaf(),
            mkNANode(
                4,
                mkNALeaf(),
                mkNALeaf()
            )
        )
    );


/* ----------------------------------------------------- **
Write a function that builds a data structure of type NestedArray<T>
out of an array of T. It does so by 
1. creating a leaf node if `arr` is empty
2. splitting `arr` into `arr1` and `arr2`  following the same specification
   as `splitArrayOnce` and
   - using the last element of `arr1` as the value of the current node
   - recursively using `arr1` without the last element as the left child and
   - recursively using `arr2 as the right child.
Example 1:
    splitArray([]) = tr1
           *
Example 2:
    splitArray([1]) = tr2
          1
         / \ 
        *   *
Example 3:
    splitArray(["hello", "world"]) = tr3
       "hello"
       /    \
      *    "world"
            /  \
           *    *
Example 4:
    splitArray(["csc600", "is", "fun"]) = tr4
        
          "is"
         /    \
   "csc600"   "fun"
      / \      / \
     *   *    *   *
Example 5:
    splitArray([3, 2, 1, 4]) = tr5
        
            2
          /   \   
         3     1
        / \   / \ 
       *   * *   4
                / \
               *   *
** ----------------------------------------------------- */

export function splitArray<T>(arr: T[]): NestedArray<T> {
    if(arr.length === 0){
        return mkNALeaf();
    }else if(arr.length === 1){
        return mkNANode(arr[0], mkNALeaf(), mkNALeaf());
    } else {
        let arr1: T[] = [];
        let arr2: T[] = [];
        const hlf = Math.ceil(arr.length / 2);
        arr1 = arr.slice(0, hlf);
        arr2 = arr.slice(hlf);
        //console.log("1 : ",arr1[arr1.length-1], "2 : ", arr1.slice(0, arr1.length-1), "3 : ",arr2)
        return mkNANode(arr1[arr1.length-1], splitArray(arr1.slice(0, arr1.length-1)) , splitArray(arr2))

    }
}





/* ==========================================================================  **
## Problem 3: Recursive functions with trees
An NaryTree is a Tree that has any number of children.
Example 1 (ntr1):
     *   (no children)
Example 2 (ntr2):
     1   (1 child)
     |
     * 
Example 3 (ntr3):
     1   (1 child)
     |
     2   (1 child)
     |
     *
Example 4 (ntr4):
      1     (2 children)
     / \
    2   3   (1 child)
    |   |
    *   *
Example 5 (ntr5):
         1       (1 child)
         |
         2       (3 children)
       / | \  
      3  4  5    (1 child)
      |  |  |
      *  *  6    (1 child)
            |
            *
** ============================================================================ */

export type NaryTree<T> = 
    {
        tag: "LEAF",                     // no children
    }
|   {
        tag: "NODE",
        contents: T,
        firstChild: NaryTree<T>,         // contains the first child
        restChildren: NaryTree<T>[]      // contains children 2 through ...
    }

export function mkNaryLeaf<T>(): NaryTree<T>{
    return {
        tag: "LEAF"
    };
}

export function mkNaryNode<T>(contents: T, children: NaryTree<T>[]): NaryTree<T>{
    if (children.length === 0) {
        return {
            tag: "NODE",
            contents: contents,
            firstChild: mkNaryLeaf(),
            restChildren: []
        }
    } else {
        return {
            tag: "NODE",
            contents: contents,
            firstChild: children[0],
            restChildren: children.slice(1)
        };
    }
}

const ntr1 : NaryTree<number> =
    mkNaryLeaf();

const ntr2 =
    mkNaryNode(
        1,
        []
    );

const ntr3 =
    mkNaryNode(
        1,
        [
            mkNaryNode(2, [])
        ]
    );

const ntr4 =
    mkNaryNode(
        1,
        [
            mkNaryNode(2, []),
            mkNaryNode(3, [])
        ]
    );

const ntr5 =
    mkNaryNode(
        1,
        [
            mkNaryNode(
                2,
                [
                    mkNaryNode(3, []),
                    mkNaryNode(4, []),
                    mkNaryNode(
                        5, 
                        [
                            mkNaryNode(6, []),
                        ]),
                ]
            )
        ]
    );


/* ----------------------------------------------------- **
### Problem 3a:
Example 1:
    heightNaryTree(ntr1) = 0
Example 2:
    heightNaryTree(ntr2) = 1
Example 3:
    heightNaryTree(ntr3) = 2
Example 4:
    heightNaryTree(ntr4) = 2
Example 5:
    heightNaryTree(ntr5) = 4
** ----------------------------------------------------- */

export function heightNaryTree<T>(naTr: NaryTree<T>): number {
    let arr: number[] = [];

    switch (naTr.tag) {
        case "LEAF": {
            return 0;
        }
        case "NODE": {
            if(naTr.restChildren.length === 0){
                return 1 + heightNaryTree(naTr.firstChild);
            } else{
                for(let i = 0; i < naTr.restChildren.length; i++){
                    arr.push(heightNaryTree(naTr.restChildren[i]));
                }
            }
            return 1 + Math.max(...arr);
        }
    }
}


/* ----------------------------------------------------- **
### Problem 3b:
Example 1:
    mapNaryTree(ntr1, (x) => x + 1) =
     *
Example 2:
    mapNaryTree(ntr2, (x) => x + 1) =
     
     2
     |
     *
Example 3:
    mapNaryTree(ntr3, (x) => 2*x) =
     2
     |
     4
     |
     *
Example 4:
    mapNaryTree(ntr4, (x) => 1) =
      1 
     / \
    1   1
    |   |
    *   *
Example 5:
    mapNaryTree(ntr5, (x) => x + 2) =
         3
         |
         4 
       / | \  
      5  6  7
      |  |  |
      *  *  8
            |
            * 
** ----------------------------------------------------- */

export function mapNaryTree<T, U>(naTr: NaryTree<T>, f: (arg: T) => U): NaryTree<U> {
    let chld: NaryTree<U>[] = [];
    let tree = naTr;
    let tr = tree as unknown as NaryTree<U>

    switch (tree.tag) {
        case "LEAF": {
            return mkNALeaf() as unknown as NaryTree<U>;
        }
        case "NODE": {
            if(tree.restChildren){
                for(let i = 0; i < tree.restChildren.length; i++){
                    chld.push(mapNaryTree(tree.restChildren[i], f));
                    //console.log("chld ==> ", chld);
                }
            }
            chld.push(mapNaryTree(tree.firstChild, f));
            return mkNaryNode(f(tree.contents), chld);
        }
    }
}


/* ----------------------------------------------------- **
### Problem 3c:
Recursively convert a data-structure of type `NestedArray<T>` into a 
data-structure of type `NaryTree<T>` following these rules:
1. a NestedArray leaf is converted into a NaryTree leaf
2. a NestedArray node is converted into a NaryTree node where
   - the `left` child becomes the `firstChild`
   - the `right` child becomes the first and only element of `restChildren`.
                  1
                 / \ 
firstChild  --> *   *  <-- restChildren is 1 element array with *
Example 1:
    nestedArrayToNaryTree(tr1) =
           *
Example 2:
    nestedArrayToNaryTree(tr2) =
          1
         / \ 
        *   *
Example 3:
    nestedArrayToNaryTree(tr3) =
       "hello"
       /    \
      *    "world"
            /  \
           *    *
Example 4:
    nestedArrayToNaryTree(tr4) =
        
          "is"
         /    \
   "csc600"   "fun"
      / \      / \
     *   *    *   *
Example 5:
    nestedArrayToNaryTree(tr5) =
        
            2
          /   \   
         3     1
        / \   / \ 
       *   * *   4
                / \
               *   *
** ----------------------------------------------------- */

export function nestedArrayToNaryTree<T>(na: NestedArray<T>): NaryTree<T> {
    let naTmp = na

    switch(naTmp.tag) {
        case "LEAF": {
            return mkNaryLeaf() as unknown as NaryTree<T>;
        }
        case "NODE": {
            if(naTmp.left.tag === "NODE" && naTmp.right.tag === "NODE"){
                return mkNaryNode(naTmp.contents, [
                                                mkNaryNode(naTmp.left.contents,[nestedArrayToNaryTree(naTmp.left.left), nestedArrayToNaryTree(naTmp.left.right)]),
                                                mkNaryNode(naTmp.right.contents,[nestedArrayToNaryTree(naTmp.right.left), nestedArrayToNaryTree(naTmp.right.right)])]);
            }else if(naTmp.left.tag === "NODE" && naTmp.right.tag === "LEAF"){
                return mkNaryNode(naTmp.contents, [
                                                mkNaryNode(naTmp.left.contents,[nestedArrayToNaryTree(naTmp.left.left), nestedArrayToNaryTree(naTmp.left.right)]),
                                                nestedArrayToNaryTree(naTmp.left)
                                                ]);
            } else if(naTmp.left.tag === "LEAF" && naTmp.right.tag === "NODE"){

                return mkNaryNode(naTmp.contents, [
                                                mkNaryNode(naTmp.right.contents,[nestedArrayToNaryTree(naTmp.right.left), nestedArrayToNaryTree(naTmp.right.right)]),
                                                nestedArrayToNaryTree(naTmp.left)
                                                ]);

            } else if (naTmp.left.tag === "LEAF" && naTmp.right.tag === "LEAF"){
                return mkNaryNode(naTmp.contents, [nestedArrayToNaryTree(naTmp.left), nestedArrayToNaryTree(naTmp.right)]);
            } else{
                throw Error("Input not formatted correctly")
            }
        }
    }
}
