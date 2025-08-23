#!/bin/bash

echo "=== KIE Server Facts ==="
echo ""

response=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -u admin:admin \
  -d '{
    "commands": [
      {
        "get-objects": {
          "out-identifier": "allFacts"
        }
      }
    ]
  }' \
  http://localhost:8080/kie-server/services/rest/server/containers/instances/fakebook-rules)

echo "Status: $(echo "$response" | jq -r '.type')"
echo "Message: $(echo "$response" | jq -r '.msg')"
echo ""
echo "Facts in working memory:"
echo "$response" | jq '.result."execution-results".results[0].value'