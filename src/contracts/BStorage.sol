pragma solidity ^0.8.0;

contract BStorage {
  string public name = 'BStorage';

  // Store Files
  uint public postCount = 0;
  mapping(uint => Post) public posts;

  struct Post {
    uint id;
    string hash;
    string description;
    string filename;
    uint tipAmount;
    address payable author;
  }

  event PostCreated(
    uint id,
    string hash,
    string description,
    string filename,
    uint tipAmount,
    address payable author
  );

  event PostTipped(
    uint id,
    string hash,
    string description,
    string filename,
    uint tipAmount,
    address payable author
  );

  // Create Posts
  function uploadPost(string memory _postHash, string memory _description, string memory _filename) public {
    // Make sure hash exists
    require(bytes(_postHash).length > 0);

    // Make sure it's not empty
    require(bytes(_description).length > 0);

    // Make sure uploader address exists
    require(msg.sender != address(0x0));

    // Increment post id
    postCount ++;

    // Add post to contract
    posts[postCount] = Post(postCount, _postHash, _description, _filename, 0, payable(msg.sender));

    // Trigger an event
    emit PostCreated(postCount, _postHash, _description, _filename, 0, payable(msg.sender));
  }

  // Tip Posts
  function tipPostOwner(uint _id) public payable {
    // Make sure the id is valid
    require(_id > 0 && _id <= postCount);
    // Fetch the post
    Post memory _post = posts[_id];

    // Fetch the author
    address payable _author = _post.author;

    // Send eth
    _author.transfer(msg.value);

    // Increment the tip amount
    _post.tipAmount = _post.tipAmount + msg.value;

    // Update the post
    posts[_id] = _post;

    // Trigger event
    emit PostTipped(_id, _post.hash, _post.description, _post.filename, _post.tipAmount, _author);
  }
}