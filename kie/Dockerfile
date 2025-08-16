FROM quay.io/kiegroup/kie-server:latest

USER root

ARG KIE_ADMIN_USER=admin
ARG KIE_ADMIN_PWD=admin
ARG KIE_SERVER_ID=kie-server

RUN mkdir -p /opt/jboss/.m2/repository/com/fakebook/kie-fakebook/1.0.0/

RUN /opt/jboss/wildfly/bin/add-user.sh -a -u ${KIE_ADMIN_USER} -p ${KIE_ADMIN_PWD} -g admin,${KIE_SERVER_ID}

RUN chown -R jboss:jboss /opt/jboss/.m2/

USER jboss

EXPOSE 8080

CMD ["/opt/jboss/wildfly/bin/standalone.sh", "-b", "0.0.0.0", "-c", "standalone-full.xml"]