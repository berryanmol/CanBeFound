// CanBeFound.com - API Client for Frontend Integration

class CanBeFoundAPI {
  constructor(baseURL = 'http://localhost:3000') {
    this.baseURL = baseURL;
    this.graphqlEndpoint = `${baseURL}/api/graphql`;
  }

  // Helper method for GraphQL requests
  async graphqlRequest(query, variables = {}) {
    try {
      const response = await fetch(this.graphqlEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          query,
          variables,
        }),
      });

      const result = await response.json();
      
      if (result.errors) {
        throw new Error(result.errors[0].message);
      }

      return result.data;
    } catch (error) {
      console.error('GraphQL request failed:', error);
      throw error;
    }
  }

  // Authentication
  async login(email, password) {
    const query = `
      mutation AuthenticateUser($email: String!, $password: String!) {
        authenticateUserWithPassword(email: $email, password: $password) {
          ... on UserAuthenticationWithPasswordSuccess {
            sessionToken
            item {
              id
              name
              email
              collegeId
              role
              isVerified
            }
          }
          ... on UserAuthenticationWithPasswordFailure {
            message
          }
        }
      }
    `;

    const data = await this.graphqlRequest(query, { email, password });
    return data.authenticateUserWithPassword;
  }

  async logout() {
    const query = `
      mutation {
        endSession
      }
    `;

    return await this.graphqlRequest(query);
  }

  async getCurrentUser() {
    const query = `
      query {
        authenticatedItem {
          ... on User {
            id
            name
            email
            collegeId
            role
            isVerified
            phone
          }
        }
      }
    `;

    const data = await this.graphqlRequest(query);
    return data.authenticatedItem;
  }

  // Items
  async getAllItems(filters = {}) {
    const { category, location, status, search, limit = 20, offset = 0 } = filters;
    
    let lostItemsWhere = {};
    let foundItemsWhere = {};

    if (category) {
      lostItemsWhere.category = { equals: category };
      foundItemsWhere.category = { equals: category };
    }

    if (location) {
      lostItemsWhere.location = { equals: location };
      foundItemsWhere.location = { equals: location };
    }

    if (search) {
      const searchFilter = {
        OR: [
          { itemName: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      };
      lostItemsWhere = { ...lostItemsWhere, ...searchFilter };
      foundItemsWhere = { ...foundItemsWhere, ...searchFilter };
    }

    const query = `
      query GetItems($lostWhere: LostItemWhereInput!, $foundWhere: FoundItemWhereInput!, $limit: Int!, $offset: Int!) {
        lostItems(where: $lostWhere, take: $limit, skip: $offset, orderBy: { createdAt: desc }) {
          id
          itemName
          description
          category
          status
          lostDate
          lostTime
          location
          specificLocation
          photo {
            url
          }
          contactEmail
          reportedBy {
            name
          }
          createdAt
        }
        foundItems(where: $foundWhere, take: $limit, skip: $offset, orderBy: { createdAt: desc }) {
          id
          itemName
          description
          category
          status
          foundDate
          foundTime
          location
          specificLocation
          photo {
            url
          }
          finderName
          reportedBy {
            name
          }
          createdAt
        }
      }
    `;

    const data = await this.graphqlRequest(query, {
      lostWhere: { ...lostItemsWhere, status: { equals: 'active' } },
      foundWhere: { ...foundItemsWhere, status: { equals: 'available' } },
      limit,
      offset,
    });

    // Format and combine items
    const lostItems = data.lostItems.map(item => ({
      ...item,
      title: item.itemName,
      date: item.lostDate,
      time: item.lostTime,
      status: 'lost',
      reportedBy: item.reportedBy?.name || 'Anonymous',
    }));

    const foundItems = data.foundItems.map(item => ({
      ...item,
      title: item.itemName,
      date: item.foundDate,
      time: item.foundTime,
      status: 'found',
      reportedBy: item.reportedBy?.name || 'Anonymous',
    }));

    return [...lostItems, ...foundItems].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  async getRecentItems(limit = 8) {
    const query = `
      query GetRecentItems($limit: Int!) {
        lostItems(where: { status: { equals: active } }, take: $limit, orderBy: { createdAt: desc }) {
          id
          itemName
          description
          category
          lostDate
          location
          photo {
            url
          }
          reportedBy {
            name
          }
        }
        foundItems(where: { status: { equals: available } }, take: $limit, orderBy: { createdAt: desc }) {
          id
          itemName
          description
          category
          foundDate
          location
          photo {
            url
          }
          reportedBy {
            name
          }
        }
      }
    `;

    const data = await this.graphqlRequest(query, { limit: Math.ceil(limit / 2) });

    const lostItems = data.lostItems.map(item => ({
      ...item,
      title: item.itemName,
      date: item.lostDate,
      status: 'lost',
      reportedBy: item.reportedBy?.name || 'Anonymous',
    }));

    const foundItems = data.foundItems.map(item => ({
      ...item,
      title: item.itemName,
      date: item.foundDate,
      status: 'found',
      reportedBy: item.reportedBy?.name || 'Anonymous',
    }));

    return [...lostItems, ...foundItems]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  }

  async getPlatformStats() {
    const query = `
      query GetStats {
        lostItemsCount(where: { status: { equals: active } })
        foundItemsCount(where: { status: { equals: available } })
        claimedItemsCount: foundItemsCount(where: { status: { equals: claimed } })
        auctionsCount(where: { status: { equals: active } })
        usersCount
        pendingClaimsCount: claimsCount(where: { status: { equals: pending } })
      }
    `;

    const data = await this.graphqlRequest(query);
    
    return {
      totalActiveItems: data.lostItemsCount + data.foundItemsCount,
      successfullyReturned: data.claimedItemsCount,
      activeLostReports: data.lostItemsCount,
      foundItemsAwaiting: data.foundItemsCount,
      itemsInAuction: data.auctionsCount,
      totalUsers: data.usersCount,
      pendingClaims: data.pendingClaimsCount,
    };
  }

  // Submit lost item report
  async submitLostItem(formData) {
    const query = `
      mutation CreateLostItem($data: LostItemCreateInput!) {
        createLostItem(data: $data) {
          id
          itemName
          status
          createdAt
        }
      }
    `;

    // First, find or create user
    const userData = {
      name: formData.fullName,
      email: formData.email,
      collegeId: formData.collegeIdContact,
      phone: formData.phone,
      role: 'student',
      isVerified: false,
    };

    const userQuery = `
      mutation CreateUser($data: UserCreateInput!) {
        createUser(data: $data) {
          id
        }
      }
    `;

    let user;
    try {
      user = await this.graphqlRequest(userQuery, { data: { ...userData, password: 'temp123' } });
    } catch (error) {
      // User might already exist, try to find them
      const findUserQuery = `
        query FindUser($collegeId: String!) {
          user(where: { collegeId: $collegeId }) {
            id
          }
        }
      `;
      const existingUser = await this.graphqlRequest(findUserQuery, { collegeId: formData.collegeIdContact });
      user = existingUser;
    }

    const itemData = {
      itemName: formData.itemName,
      description: formData.description,
      category: formData.category,
      lostDate: formData.lostDate,
      lostTime: formData.lostTime,
      location: formData.location,
      specificLocation: formData.specificLocation,
      circumstances: formData.circumstances,
      contactEmail: formData.email,
      contactPhone: formData.phone,
      privacyConsent: formData.privacyConsent,
      notifications: formData.notifications,
      reportedBy: { connect: { id: user.createUser?.id || user.user?.id } },
    };

    return await this.graphqlRequest(query, { data: itemData });
  }

  // Submit found item report
  async submitFoundItem(formData) {
    const query = `
      mutation CreateFoundItem($data: FoundItemCreateInput!) {
        createFoundItem(data: $data) {
          id
          itemName
          status
          createdAt
        }
      }
    `;

    // First, find or create user
    const userData = {
      name: formData.finderName,
      email: formData.contactEmail,
      collegeId: formData.collegeId,
      role: 'student',
      isVerified: false,
    };

    const userQuery = `
      mutation CreateUser($data: UserCreateInput!) {
        createUser(data: $data) {
          id
        }
      }
    `;

    let user;
    try {
      user = await this.graphqlRequest(userQuery, { data: { ...userData, password: 'temp123' } });
    } catch (error) {
      // User might already exist
      const findUserQuery = `
        query FindUser($collegeId: String!) {
          user(where: { collegeId: $collegeId }) {
            id
          }
        }
      `;
      const existingUser = await this.graphqlRequest(findUserQuery, { collegeId: formData.collegeId });
      user = existingUser;
    }

    const itemData = {
      itemName: formData.itemName,
      description: formData.description,
      category: formData.category,
      foundDate: formData.foundDate,
      foundTime: formData.foundTime,
      location: formData.location,
      specificLocation: formData.specificLocation,
      finderName: formData.finderName,
      contactEmail: formData.contactEmail,
      handoverLocation: formData.handoverLocation,
      customHandoverLocation: formData.customLocation,
      additionalNotes: formData.additionalNotes,
      verifyOwnership: formData.verifyOwnership,
      handoverAgreement: formData.handoverAgreement,
      reportedBy: { connect: { id: user.createUser?.id || user.user?.id } },
    };

    return await this.graphqlRequest(query, { data: itemData });
  }

  // Submit contact message
  async submitContactMessage(formData) {
    const query = `
      mutation CreateContactMessage($data: ContactMessageCreateInput!) {
        createContactMessage(data: $data) {
          id
          status
          createdAt
        }
      }
    `;

    const messageData = {
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      message: formData.message,
      status: 'new',
      priority: 'medium',
    };

    return await this.graphqlRequest(query, { data: messageData });
  }

  // Get auctions
  async getAuctions(filters = {}) {
    const { category, status, limit = 20, offset = 0 } = filters;
    
    let where = {};
    if (category) {
      where.item = { category: { equals: category } };
    }
    if (status) {
      where.status = { equals: status };
    }

    const query = `
      query GetAuctions($where: AuctionWhereInput!, $limit: Int!, $offset: Int!) {
        auctions(where: $where, take: $limit, skip: $offset, orderBy: { endTime: asc }) {
          id
          title
          description
          startingPrice
          currentBid
          bidCount
          startTime
          endTime
          status
          item {
            id
            itemName
            category
            description
            photo {
              url
            }
            location
          }
          bids(orderBy: { bidTime: desc }, take: 1) {
            amount
            bidder {
              name
            }
            bidTime
          }
        }
      }
    `;

    const data = await this.graphqlRequest(query, { where, limit, offset });
    return data.auctions;
  }

  // Place bid
  async placeBid(auctionId, amount) {
    const query = `
      mutation PlaceBid($auctionId: ID!, $amount: String!) {
        createBid(data: {
          amount: $amount,
          auction: { connect: { id: $auctionId } },
          bidder: { connect: { id: "current-user-id" } }
        }) {
          id
          amount
          bidTime
          isWinning
        }
      }
    `;

    return await this.graphqlRequest(query, { auctionId, amount: amount.toString() });
  }

  // Submit claim
  async submitClaim(itemId, itemType, proofOfOwnership) {
    const query = `
      mutation CreateClaim($data: ClaimCreateInput!) {
        createClaim(data: $data) {
          id
          status
          createdAt
        }
      }
    `;

    const claimData = {
      proofOfOwnership,
      status: 'pending',
      claimant: { connect: { id: 'current-user-id' } },
    };

    if (itemType === 'lost') {
      claimData.lostItem = { connect: { id: itemId } };
    } else {
      claimData.foundItem = { connect: { id: itemId } };
    }

    return await this.graphqlRequest(query, { data: claimData });
  }

  // Get user's items
  async getUserItems(userId) {
    const query = `
      query GetUserItems($userId: ID!) {
        user(where: { id: $userId }) {
          lostItems {
            id
            itemName
            category
            status
            lostDate
            location
            photo {
              url
            }
          }
          foundItems {
            id
            itemName
            category
            status
            foundDate
            location
            photo {
              url
            }
          }
          claims {
            id
            status
            createdAt
            lostItem {
              itemName
            }
            foundItem {
              itemName
            }
          }
          bids {
            id
            amount
            bidTime
            isWinning
            auction {
              title
              status
              endTime
            }
          }
        }
      }
    `;

    const data = await this.graphqlRequest(query, { userId });
    return data.user;
  }
}

// Create global API instance
window.API = new CanBeFoundAPI();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CanBeFoundAPI;
}