package com.fakebook.kie;

import com.fakebook.model.*;
import org.kie.api.KieServices;
import org.kie.api.runtime.KieContainer;
import org.kie.api.runtime.KieSession;
import org.kie.api.runtime.rule.FactHandle;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

@Service
public class KieService {
	private KieSession kieSession;
	private final KieContainer kieContainer;
	private final User currentUser;
	private final List<Post> feedPosts;
	private final List<Post> allPosts = new ArrayList<>();
	private final List<Like> allLikes = new ArrayList<>();

	public KieService() {
		KieServices kieServices = KieServices.get();
		kieContainer = kieServices.getKieClasspathContainer();
		kieSession = kieContainer.newKieSession("ksession-rules");

		currentUser = new User("");
		feedPosts = new ArrayList<>();

		refreshSession();
	}

	private void refreshSession() {
    List<Object> objects = new ArrayList<>(kieSession.getObjects());

    kieSession.dispose();

    KieSession newKieSession = kieContainer.newKieSession("ksession-rules");
    if (newKieSession == null) {
      throw new IllegalStateException("Failed to create KieSession with name ksession-rules");
    }

    kieSession = newKieSession;

    for (Object obj : objects) {
      kieSession.insert(obj);
    }

    kieSession.setGlobal("currentUser", currentUser);
    kieSession.setGlobal("feedPosts", feedPosts);
    kieSession.setGlobal("allPosts", allPosts);
    kieSession.setGlobal("allLikes", allLikes);
	}

	public void insertFact(Object fact, String agendaGroup) {
		if (!agendaGroup.isEmpty()) {
			kieSession.getAgenda().getAgendaGroup(agendaGroup).setFocus();
		}

		kieSession.insert(fact);
		kieSession.fireAllRules();
	}

	public void insertFact(Object fact) {
		if (fact instanceof Post) {
			allPosts.add((Post) fact);
		} else if (fact instanceof Like) {
			allLikes.add((Like) fact);
		}

		insertFact(fact, "");
	}

	public List<Post> getFeedPosts(String username) {
		refreshSession();

		currentUser.setUsername(username);
		feedPosts.clear();
		kieSession.getAgenda().getAgendaGroup("feed").setFocus();
		kieSession.fireAllRules();

		return feedPosts;
	}

	public List<Post> getAdvancedFeedPosts(String username) {
		refreshSession();

		currentUser.setUsername(username);
		feedPosts.clear();
		kieSession.getAgenda().getAgendaGroup("advanced-feed").setFocus();
		kieSession.fireAllRules();

		return feedPosts;
	}

	public List<Object> getAllFacts() {
		List<Object> facts = new ArrayList<>();
		for (Object obj : kieSession.getObjects()) {
			facts.add(obj);
		}
		return facts;
	}

	public void deleteAllFacts() {
		List<FactHandle> factHandles = new ArrayList<>(kieSession.getFactHandles());
		for (FactHandle handle : factHandles) {
			kieSession.delete(handle);
		}

		allPosts.clear();
		allLikes.clear();
		currentUser.setUsername("");
		feedPosts.clear();
	}
}
