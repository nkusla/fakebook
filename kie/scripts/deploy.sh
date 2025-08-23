echo "🔍 Checking server status..."
if curl -s -u admin:admin http://localhost:8080/kie-server/services/rest/server > /dev/null; then
    echo "✅ KIE Server is running with your custom User class and rules!"

    echo "🗑️  Deleting existing KIE container..."
    curl -X DELETE \
      -u admin:admin \
      http://localhost:8080/kie-server/services/rest/server/containers/fakebook-rules

    # Deploy the container
    echo "📦 Deploying KIE container..."
    curl -X PUT \
      -u admin:admin \
      -H "Content-Type: application/json" \
      -d '{
        "container-id": "fakebook-rules",
        "release-id": {
          "group-id": "com.fakebook",
          "artifact-id": "kie-fakebook",
          "version": "1.0.0"
        }
      }' \
      http://localhost:8080/kie-server/services/rest/server/containers/fakebook-rules

    echo ""
    echo "📋 Access Points:"
    echo "   • Server Info: http://localhost:8080/kie-server/services/rest/server"
    echo "   • Containers: http://localhost:8080/kie-server/services/rest/server/containers"
    echo "   • Swagger Docs: http://localhost:8080/kie-server/docs"
    echo "   • Credentials: admin/admin"
    echo ""
    echo "🎯 Your User class and UserRules.drl are now deployed!"
else
    echo "⚠️  Server might still be starting. Check with: docker logs kie-server"
fi
