#!/bin/bash

echo "📋 Checking existing containers..."
curl -s -u admin:admin http://localhost:8080/kie-server/services/rest/server/containers || { echo "❌ Failed to fetch containers"; exit 1; }
echo ""